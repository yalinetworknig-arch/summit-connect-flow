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
import { motion } from "framer-motion";
import {
  Reveal,
  Stagger,
  staggerChild,
  SideLabel,
  HalftoneBackdrop,
  Eyebrow,
} from "@/components/motion-primitives";

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
      <section className="relative px-6 py-20 md:py-28 bg-background text-text-primary overflow-hidden">
        <HalftoneBackdrop />
        <SideLabel>Partner · Sponsor · Co-host</SideLabel>
        <SideLabel side="right" tone="muted">2,000+ delegates · 7 tracks</SideLabel>
        <div className="relative max-w-4xl mx-auto text-center">
          <Reveal><Eyebrow>Partner with AIDIFILN</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display font-bold text-4xl md:text-6xl mt-5 mb-6 leading-[1.05]">
              Reach Nigeria's next generation of{" "}
              <span className="text-accent-cyan">leaders.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              2,000+ delegates. 7 sector tracks. National and international press.
              Choose the tier that matches your goals — or tell us what you want
              and we'll build a custom package.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-20 bg-background text-text-primary">
        <Stagger className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPONSOR_TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={staggerChild}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className={`relative rounded-3xl border p-7 flex flex-col overflow-hidden transition-colors ${
                t.highlight
                  ? "border-accent-cyan bg-surface ring-1 ring-accent-cyan/40"
                  : "border-border-strong bg-surface hover:border-accent-cyan/60"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-accent-cyan text-brand-navy">
                  Most popular
                </span>
              )}
              <span
                aria-hidden
                className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.3em] text-text-secondary/60"
              >
                0{i + 1}
              </span>
              <h3 className="font-display font-bold text-xl mb-2">{t.name}</h3>
              <p className="text-3xl font-display font-bold text-accent-cyan mb-6">
                {t.price}
              </p>
              <ul className="space-y-2.5 text-sm text-text-primary flex-1">
                {t.benefits.map((b) => (
                  <li key={b} className="flex gap-2 leading-snug">
                    <Check className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#inquiry"
                className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase border border-accent-cyan/60 text-accent-cyan hover:bg-accent-cyan hover:text-brand-navy transition-colors self-start"
              >
                Choose tier
              </a>
            </motion.div>
          ))}
        </Stagger>
      </section>

      <section
        id="inquiry"
        className="relative px-6 py-20 md:py-28 bg-surface text-text-primary overflow-hidden"
      >
        <SideLabel tone="muted">Inquiry · 48-hour reply</SideLabel>
        <div className="relative max-w-2xl mx-auto">
          <Reveal><Eyebrow>Become a sponsor</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-4 mb-3 leading-tight">
              Tell us what you want to <span className="text-accent-cyan">build with us.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-text-secondary mb-8 text-lg">
              Share a few details and our partnerships team will be in touch within
              48 hours.
            </p>
          </Reveal>

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