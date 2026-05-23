import { useEffect, useMemo, useState } from "react";
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
  "Select Your Attendee Type",
  "Personal Information",
  "Choose Your Track",
  "Logistics & Preferences",
  "Review & Payment",
];

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setForm({ ...initialFormState, ...draft });
  }, []);

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

  function next() {
    if (validateCurrent()) {
      setErrors({});
      setStep((s) => Math.min(5, s + 1));
    }
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
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <header className="mb-8">
        <h1
          className="font-bold mb-2"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "var(--text-primary)",
          }}
        >
          Register for AIDIFILN 2026
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
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance}
            className="px-7 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            Next
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <button
            type="button"
            onClick={back}
            className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            Back
          </button>
        </div>
      )}
    </section>
  );
}