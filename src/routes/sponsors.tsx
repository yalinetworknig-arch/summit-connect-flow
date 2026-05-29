import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { submitSponsorInquiry } from "@/lib/inquiries.functions";
import {
  SPONSOR_TIERS,
  SPONSOR_TIER_OPTIONS,
  BUDGET_RANGES,
  DECISION_TIMELINES,
} from "@/lib/event-data";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Sponsors — YALI Summit 2026" },
      { name: "description", content: "Sponsor portal: deck download and inquiry form." },
      { property: "og:title", content: "Sponsors — YALI Summit 2026" },
      { property: "og:description", content: "Partner with the YALI Network Nigeria Summit 2026 (AIDIFILN)." },
    ],
  }),
  component: SponsorsPage,
});

function SponsorsPage() {
  const submit = useServerFn(submitSponsorInquiry);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    try {
      await submit({ data: payload as never });
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit");
      setStatus("error");
    }
  }

  return (
    <>
      <section className="px-6 py-16 md:py-20 bg-background text-text-primary">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-4">
            Partner with AIDIFILN
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Reach Nigeria's next generation of leaders.
          </h1>
          <p className="text-lg text-text-secondary">
            2,000+ delegates. 7 sector tracks. National and international press.
            Choose the tier that matches your goals — or tell us what you want
            and we'll build a custom package.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:pb-20 bg-background text-text-primary">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPONSOR_TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                t.highlight
                  ? "border-accent-cyan bg-surface"
                  : "border-border-strong bg-surface"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-accent-cyan text-brand-navy">
                  Most popular
                </span>
              )}
              <h3 className="font-display font-bold text-xl mb-1">{t.name}</h3>
              <p className="text-3xl font-display font-bold text-accent-cyan mb-5">
                {t.price}
              </p>
              <ul className="space-y-2 text-sm text-text-primary flex-1">
                {t.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="inquiry"
        className="px-6 py-16 md:py-24 bg-surface text-text-primary"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">
            Become a sponsor
          </h2>
          <p className="text-text-secondary mb-8">
            Share a few details and our partnerships team will be in touch within
            48 hours.
          </p>

          {status === "ok" ? (
            <div className="rounded-2xl border border-accent-cyan bg-background p-8 text-center">
              <Check className="w-10 h-10 text-accent-cyan mx-auto mb-3" />
              <h3 className="font-display font-semibold text-xl mb-1">
                Inquiry received
              </h3>
              <p className="text-text-secondary">
                We'll be in touch shortly. Thank you for partnering with us.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border-strong bg-background p-6 md:p-8 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Company" name="company_name" required />
                <Field label="Your name" name="contact_name" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" required />
                <Select label="Preferred tier" name="preferred_tier" options={SPONSOR_TIER_OPTIONS} />
                <Select label="Budget range" name="budget_range" options={BUDGET_RANGES} />
                <Select label="Decision timeline" name="decision_timeline" options={DECISION_TIMELINES} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Goals & questions
                </label>
                <textarea
                  name="goals"
                  required
                  rows={4}
                  minLength={10}
                  maxLength={1500}
                  className="w-full rounded-xl border border-border-strong bg-background p-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                  placeholder="What do you want to achieve at AIDIFILN 2026?"
                />
              </div>
              {error && <p className="text-sm text-error">{error}</p>}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full px-7 py-3 rounded-full text-base font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.01] transition-transform disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Submit inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="w-full rounded-xl border border-border-strong bg-background p-3 text-text-primary focus:outline-none focus:border-accent-cyan"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <select
        name={name}
        required
        defaultValue=""
        className="w-full rounded-xl border border-border-strong bg-background p-3 text-text-primary focus:outline-none focus:border-accent-cyan"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}