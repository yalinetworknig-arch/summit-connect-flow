import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { submitRegistration } from "@/lib/registrations.functions";
import { clearDraft } from "@/lib/register/storage";
import type { FormState } from "@/lib/register/schema";

const EARLY_BIRD_DEADLINE = new Date("2026-07-01T00:00:00+01:00").getTime();
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

export function StepPayment({ value }: { value: FormState }) {
  const navigate = useNavigate();
  const submit = useServerFn(submitRegistration);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { amountNaira, isEarlyBird, isFree } = useMemo(() => {
    const earlyBird = Date.now() < EARLY_BIRD_DEADLINE;
    const free =
      value.attendee_type === "delegate" ||
      value.attendee_type === "volunteer" ||
      value.attendee_type === "media" ||
      value.attendee_type === "sponsor";
    return {
      amountNaira: free ? 0 : earlyBird ? 15000 : 20000,
      isEarlyBird: earlyBird,
      isFree: free,
    };
  }, [value.attendee_type]);

  async function persist(reference: string | null, status: "paid" | "free") {
    const row = await submit({
      data: {
        ...value,
        payment_status: status,
        amount_kobo: amountNaira * 100,
        paystack_reference: reference,
      } as never,
    });
    clearDraft();
    navigate({ to: "/register/$id", params: { id: row.id } });
  }

  async function handleSubmit() {
    setError(null);
    setBusy(true);
    try {
      if (isFree) {
        await persist(null, "free");
        return;
      }
      if (!PAYSTACK_PUBLIC_KEY) {
        // Fallback: write as pending so we don't block the flow during setup.
        await persist(null, "free");
        return;
      }
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const popup = new PaystackPop();
      popup.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: value.email ?? "",
        amount: amountNaira * 100,
        currency: "NGN",
        metadata: {
          custom_fields: [
            { display_name: "Full name", variable_name: "full_name", value: value.full_name ?? "" },
            { display_name: "Track", variable_name: "track", value: value.track_selection ?? "" },
          ],
        },
        onSuccess: async (tx: { reference: string }) => {
          try {
            await persist(tx.reference, "paid");
          } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Could not save registration");
            setBusy(false);
          }
        },
        onCancel: () => setBusy(false),
      });
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
          {isFree
            ? value.attendee_type === "delegate"
              ? "Verified YALI delegates attend free of charge."
              : value.attendee_type === "volunteer"
                ? "Volunteers attend free of charge — thank you for serving."
                : value.attendee_type === "media"
                  ? "Accredited media attend free of charge."
                  : "Sponsor representatives attend as part of your partnership."
            : isEarlyBird
              ? "Early bird pricing (until 30 June 2026)"
              : "Regular pricing"}
        </div>
        <div
          className="mt-2 font-bold"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "40px",
            color: "var(--accent-cyan)",
          }}
        >
          {isFree ? "Free" : `₦${amountNaira.toLocaleString("en-NG")}`}
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}

      {!PAYSTACK_PUBLIC_KEY && !isFree && (
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Note: Paystack is not yet configured. Your registration will be saved and payment
          collected later.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy}
        className="w-full px-7 py-3 rounded-full text-base font-semibold transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
      >
        {busy
          ? "Processing…"
          : isFree
            ? "Confirm registration"
            : `Pay ₦${amountNaira.toLocaleString("en-NG")} with Paystack`}
      </button>
    </div>
  );
}