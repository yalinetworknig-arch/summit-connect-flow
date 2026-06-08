import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nextBusy, setNextBusy] = useState(false);
  const topRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setForm({ ...initialFormState, ...draft });
  }, []);

  // Scroll to top of form on every step change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function patch(p: FormState) {
    setForm((prev) => {
      const next = { ...prev, ...p };
      saveDraft(next);
      return next;
    });
  }

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

  async function next() {
    if (!validateCurrent()) return;
    setErrors({});

    // On step 2: pre-check if email already exists so users find out NOW not at step 5
    if (step === 2 && form.email) {
      setNextBusy(true);
      try {
        const { data } = await supabase
          .from("registrations")
          .select("id")
          .eq("email", form.email.trim().toLowerCase())
          .maybeSingle();
        if (data) {
          setErrors({
            email:
              "This email is already registered. Sign in to view your ticket, or use a different email address.",
          });
          setNextBusy(false);
          return;
        }
      } catch {
        // If check fails just let them proceed — the insert will catch it
      }
      setNextBusy(false);
    }

    setStep((s) => Math.min(5, s + 1));
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  const canAdvance =
    (step === 1 && step1Schema.safeParse(form).success) ||
    (step === 2 && step2Schema.safeParse(form).success) ||
    (step === 3 && step3Schema.safeParse(form).success) ||
    (step === 4 && step4Schema.safeParse(form).success);

  return (
    <section ref={topRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14 scroll-mt-20">
      <header className="mb-8">
        <h1
          className="font-bold mb-2"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "var(--text-primary)",
          }}
        >
          Claim your seat at AIDIFILN 2026
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>{TITLES[step - 1]}</p>
      </header>

      <ProgressIndicator current={step} />

      <div
        className="rounded-2xl border p-5 sm:p-7"
        style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
      >
        {step === 1 && <StepAttendeeType value={form} onChange={patch} />}
        {step === 2 && <StepPersonalInfo value={form} errors={errors} onChange={patch} />}
        {step === 3 && (
          <StepTrack value={form} error={errors.track_selection} onChange={patch} />
        )}
        {step === 4 && <StepLogistics value={form} errors={errors} onChange={patch} />}
        {step === 5 && <StepPayment value={form} />}
      </div>

      {step < 5 ? (
        <div className="flex items-center justify-between mt-6 gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="px-6 py-3 rounded-full text-sm font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px]"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance || nextBusy}
            className="flex-1 sm:flex-none px-8 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center gap-2"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            {nextBusy ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Checking…
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <button
            type="button"
            onClick={back}
            className="px-6 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[48px]"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            ← Back
          </button>
        </div>
      )}
    </section>
  );
}