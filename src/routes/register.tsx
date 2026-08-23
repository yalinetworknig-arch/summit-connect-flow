import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "@/components/register/ProgressIndicator";
import { StepAttendeeType } from "@/components/register/StepAttendeeType";
import { StepPersonalInfo } from "@/components/register/StepPersonalInfo";
import { StepTrack } from "@/components/register/StepTrack";
import { StepLogistics } from "@/components/register/StepLogistics";
import { StepPayment } from "@/components/register/StepPayment";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  initialFormState,
  type FormState,
} from "@/lib/register/schema";
import { loadDraft, saveDraft } from "@/lib/register/storage";
import { supabase } from "@/integrations/supabase/client";
import { stepVariants, errorShake, ctaButton, ease } from "@/lib/motion";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — YALI Summit 2026" },
      { name: "description", content: "Register for the YALI Network Nigeria Summit 2026." },
      { property: "og:title", content: "Register — YALI Summit 2026" },
      { property: "og:description", content: "Register for the YALI Network Nigeria Summit 2026." },
    ],
  }),
  component: RegisterPage,
});

const TITLES = [
  "First — who's coming?",
  "Tell us about you",
  "Pick the room you want to shape",
  "Logistics and preferences",
  "Review and confirm your seat",
];

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // +1 = forward, -1 = back
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nextBusy, setNextBusy] = useState(false);
  const [shaking, setShaking] = useState(false);
  const topRef = useRef<HTMLElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setForm({ ...initialFormState, ...draft });
  }, []);

  // Scroll to top of form on every step change (instant for better performance)
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [step]);

  const patch = useCallback((p: FormState) => {
    setForm((prev) => {
      const next = { ...prev, ...p };
      // Debounce draft save — only save after 800ms of inactivity
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveDraft(next);
      }, 800);
      // Immediately save if attendee_type is being set (critical for form flow)
      if (p.attendee_type) {
        saveDraft(next);
      }
      return next;
    });
  }, []);

  const validateCurrent = useMemo(() => {
    return () => {
      const map: Record<string, string> = {};
      const collect = (
        res:
          | { success: true }
          | { success: false; error: { issues: Array<{ path: Array<string | number>; message: string }> } },
      ) => {
        if (!res.success) {
          for (const issue of res.error.issues) {
            const key = issue.path.join(".");
            if (key && !map[key]) map[key] = issue.message;
          }
        }
        return res.success;
      };
      let ok = false;
      if (step === 1) ok = collect(step1Schema.safeParse(form));
      else if (step === 2) ok = collect(step2Schema.safeParse(form));
      else if (step === 3) ok = collect(step3Schema.safeParse(form));
      else if (step === 4) ok = collect(step4Schema.safeParse(form));
      else ok = true;
      setErrors(map);
      return ok;
    };
  }, [step, form]);

  // Trigger shake animation on validation failure
  function triggerShake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  async function next() {
    if (!validateCurrent()) {
      triggerShake();
      return;
    }
    setErrors({});

    // On step 2: pre-check email uniqueness (with 3s timeout for better speed)
    if (step === 2 && form.email) {
      setNextBusy(true);
      try {
        const timeoutPromise = new Promise<any>((resolve) =>
          setTimeout(() => resolve(null), 3000)
        );
        const checkPromise = supabase
          .from("registrations")
          .select("id", { count: "exact", head: true })
          .eq("email", form.email.trim().toLowerCase())
          .maybeSingle();

        const result = await Promise.race([checkPromise, timeoutPromise]);

        if (result?.data) {
          setErrors({
            email: "This email is already registered. Sign in to view your ticket, or use a different email address.",
          });
          triggerShake();
          setNextBusy(false);
          return;
        }
      } catch {
        // Query error — let final submission catch it
      }
      setNextBusy(false);
    }

    setDirection(1);
    setStep((s) => Math.min(5, s + 1));
  }

  function back() {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  }

  const canAdvance = useMemo(() => {
    return (
      (step === 1 && step1Schema.safeParse(form).success) ||
      (step === 2 && step2Schema.safeParse(form).success) ||
      (step === 3 && step3Schema.safeParse(form).success) ||
      (step === 4 && step4Schema.safeParse(form).success)
    );
  }, [step, form]);

  const variants = useMemo(() => stepVariants(direction), [direction]);

  return (
    <section
      ref={topRef}
      className="mx-auto px-4 sm:px-6 py-10 md:py-14 scroll-mt-20 register-ambient"
      style={{ maxWidth: "clamp(300px, 90vw, 48rem)" }}
    >
      {/* Page entrance */}
      <motion.header
        className="mb-8"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1
              className="font-bold"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "var(--text-primary)",
              }}
            >
              Claim your seat at AIDIFILN 2026
            </h1>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap" style={{ background: "var(--surface)", color: "var(--text-secondary)" }}>
            ⏱️ ~3 min
          </div>
        </div>
        {/* Animated subtitle crossfade on step change */}
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: ease.out }}
            style={{ color: "var(--text-secondary)" }}
          >
            {TITLES[step - 1]} <span className="text-xs opacity-70">({step} of 5)</span>
          </motion.p>
        </AnimatePresence>
      </motion.header>

      <div>
        <ProgressIndicator current={step} />
      </div>

      {/* Step content with direction-aware slide transitions + error shake */}
      <motion.div
        animate={shaking ? errorShake.shake : errorShake.idle}
        className="overflow-hidden"
      >
        <div
          className="rounded-2xl border-2 p-6 sm:p-8 overflow-hidden shadow-md transition-all duration-200"
          style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
          onKeyDown={(e) => {
            // Allow Enter key to submit current step (but not in textarea)
            if (
              e.key === "Enter" &&
              e.currentTarget.tagName !== "TEXTAREA" &&
              !(e.target as HTMLElement).tagName.includes("TEXTAREA") &&
              canAdvance &&
              !nextBusy &&
              step < 5
            ) {
              e.preventDefault();
              next();
            }
          }}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === 1 && <StepAttendeeType value={form} onChange={patch} />}
              {step === 2 && <StepPersonalInfo value={form} errors={errors} onChange={patch} />}
              {step === 3 && (
                <StepTrack value={form} error={errors.track_selection} onChange={patch} />
              )}
              {step === 4 && <StepLogistics value={form} errors={errors} onChange={patch} />}
              {step === 5 && <StepPayment value={form} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation buttons */}
      <div>
        {step < 5 ? (
          <div className="flex items-center justify-between mt-6 gap-3">
            {/* Back Button - use native button for proper React event handling */}
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="px-6 py-3 rounded-lg text-sm font-semibold border-2 disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px] transition-all duration-200 hover:shadow-md"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
            >
              Back
            </button>

            {/* Next Button - use native button for proper React event handling */}
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance || nextBusy}
              className="flex-1 sm:flex-none px-8 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
              style={{
                background: "var(--accent-cyan)",
                color: "var(--brand-navy)",
                boxShadow: canAdvance && !nextBusy
                  ? "0 4px 20px color-mix(in oklab, var(--accent-cyan) 35%, transparent)"
                  : "none",
              }}
            >
              {nextBusy ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Verifying email…</span>
                </>
              ) : (
                <>
                  Next
                  <span className="opacity-60 text-xs">
                    →
                  </span>
                </>
              )}
            </button>

            {/* Animated overlay for hover/tap effects */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={false}
            />
          </div>
        ) : (
          <div className="mt-6">
            <motion.button
              type="button"
              onClick={back}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="px-6 py-3 rounded-lg text-sm font-semibold border-2 min-h-[48px] transition-all duration-200 hover:shadow-md"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
            >
              ← Back
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
