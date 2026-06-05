import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { submitRegistration } from "@/lib/registrations.functions";
import { clearDraft } from "@/lib/register/storage";
import type { FormState } from "@/lib/register/schema";

export function StepPayment({ value }: { value: FormState }) {
  const navigate = useNavigate();
  const submit = useServerFn(submitRegistration);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { amountNaira, paymentLabel } = useMemo(() => {
    const manualPaymentTypes = ["delegate", "volunteer", "media", "sponsor"];
    const isManualOnly = manualPaymentTypes.includes(value.attendee_type ?? "");
    return {
      amountNaira: isManualOnly ? 0 : 20000,
      paymentLabel: isManualOnly
        ? "No online payment is required at this stage. Our team will confirm any offline payment details manually."
        : "Registration will be submitted now. Payment, if needed, will be handled manually after confirmation.",
    };
  }, [value.attendee_type]);

  async function persist() {
    const row = await submit({
      data: {
        ...value,
        payment_status: amountNaira > 0 ? "pending" : "free",
        amount_kobo: amountNaira * 100,
        paystack_reference: null,
      } as never,
    });
    clearDraft();
    navigate({ to: "/register/$id", params: { id: row.id } });
  }

  async function handleSubmit() {
    setError(null);
    setBusy(true);
    try {
      await persist();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {paymentLabel}
        </div>
        <div
          className="mt-2 font-bold"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "40px",
            color: "var(--accent-cyan)",
          }}
        >
          {amountNaira > 0 ? `₦${amountNaira.toLocaleString("en-NG")}` : "Manual review"}
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy}
        className="w-full px-7 py-3 rounded-full text-base font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
      >
        {busy ? "Processing…" : "Complete registration"}
      </button>
    </div>
  );
}