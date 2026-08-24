import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Check, Download } from "lucide-react";
import { submitSponsorInquiry } from "@/lib/inquiries.functions";
import {
  SPONSOR_TIERS,
  SPONSOR_TIER_OPTIONS,
  BUDGET_RANGES,
  DECISION_TIMELINES,
} from "@/lib/event-data";
import {
  Reveal,
  Stagger,
  staggerChild,
  SideLabel,
  HalftoneBackdrop,
  Eyebrow,
} from "@/components/motion-primitives";
import { EditorialImage } from "@/components/editorial/EditorialImage";
import sponsorsImpact from "@/assets/event-photos/yleeds-keynote-speaker.jpg";

export function SponsorsSection({ id = "sponsors" }: { id?: string }) {
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
    <div id={id} className="scroll-mt-24">
      <section className="relative px-5 sm:px-6 lg:px-8 bg-background text-text-primary overflow-hidden" style={{ padding: "clamp(3rem, 10vw, 8rem) 1.25rem" }}>
        <HalftoneBackdrop />
        <SideLabel>Partner · Sponsor · Co-host</SideLabel>
        <SideLabel side="right" tone="muted">400–800 delegates · 7 tracks</SideLabel>
        <div className="relative max-w-4xl mx-auto text-center">
          <Reveal><Eyebrow>Partnership, sponsorship, co-hosting</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mt-5 mb-6 leading-[1.05]">
              Be at the table where{" "}
              <span className="text-accent-cyan">Nigeria's civic future gets decided.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              400–800 leaders. All 36 states. Seven sector rooms making named commitments. National and international media. Tell us the outcome you want — we'll build the partnership around it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Impact strip — what sponsorship buys, visually */}
      <section className="px-5 sm:px-6 lg:px-8 -mt-6 md:-mt-10 mb-4 md:mb-8 bg-background">
        <div className="max-w-6xl mx-auto relative">
          <EditorialImage
            src={sponsorsImpact}
            alt="A YALI Network Nigeria speaker at the podium, backed by the United States Diplomatic Mission in Nigeria banner, at Y-LEEDS 2025"
            aspect="aspect-[16/9] md:aspect-[21/9]"
            sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
            width={1920}
            height={1080}
          />
          {/* Stat overlay band */}
          <div className="hidden md:flex absolute inset-x-0 bottom-0 z-10 pointer-events-none">
            <div className="mx-auto mb-5 px-6 py-3 rounded-full bg-background/80 backdrop-blur-md border border-border-strong flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-text-primary">
              <span><span className="text-accent-cyan">400–800</span> delegates</span>
              <span className="text-text-secondary/40">·</span>
              <span><span className="text-accent-cyan">36</span> states</span>
              <span className="text-text-secondary/40">·</span>
              <span><span className="text-accent-cyan">7</span> sectors</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-6 lg:px-8 pb-12 bg-background text-text-primary">
        <Stagger className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {SPONSOR_TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={staggerChild}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className={`relative rounded-3xl border p-6 flex flex-col overflow-hidden transition-colors ${
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
              <p className="text-2xl font-display font-bold text-accent-cyan mb-6 leading-tight">
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
                href="#sponsor-inquiry"
                className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase border border-accent-cyan/60 text-accent-cyan hover:bg-accent-cyan hover:text-brand-navy transition-colors self-start"
              >
                Choose tier
              </a>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* Prospectus download — full tier breakdown, benefits and remittance details */}
      <section className="px-5 sm:px-6 lg:px-8 pb-20 bg-background text-text-primary">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-border-strong bg-surface p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="font-display font-bold text-xl md:text-2xl mb-1.5">
                Want the full breakdown?
              </h3>
              <p className="text-text-secondary max-w-xl">
                Every tier, benefit and remittance detail — in one PDF. Download the AIDIFILN 2026 partnership prospectus to review at your own pace or share with your team.
              </p>
            </div>
            <a
              href="/AIDIFILN-2026-Partnership-Prospectus.pdf"
              download
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.03] active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4" /> Learn more &amp; download prospectus
            </a>
          </div>
        </div>
      </section>

      <section
        id="sponsor-inquiry"
        className="relative px-5 sm:px-6 lg:px-8 bg-surface text-text-primary overflow-hidden scroll-mt-24"
        style={{ padding: "clamp(3rem, 10vw, 8rem) 1.25rem" }}
      >
        <SideLabel tone="muted">Inquiry · 48-hour reply</SideLabel>
        <div className="relative max-w-2xl mx-auto">
          <Reveal><Eyebrow>Become a sponsor</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h3 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mt-4 mb-3 leading-tight">
              Tell us what you want to <span className="text-accent-cyan">build with us.</span>
            </h3>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-text-secondary mb-8 text-lg">
              Three minutes to fill. 48 hours to a human reply. No deck downloads required.
            </p>
          </Reveal>

          {status === "ok" ? (
            <div className="rounded-2xl border border-accent-cyan bg-background p-8 text-center">
              <Check className="w-10 h-10 text-accent-cyan mx-auto mb-3" />
              <h4 className="font-display font-semibold text-xl mb-1">
                Got it — we're on it.
              </h4>
              <p className="text-text-secondary">
                A real human from the partnerships team will reply within 48 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border-2 border-border-strong bg-background/80 p-6 md:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Company" name="company_name" required />
                <Field label="Your name" name="contact_name" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" required />
                <Select label="Preferred tier" name="preferred_tier" options={SPONSOR_TIER_OPTIONS} />
                <Select label="Budget range" name="budget_range" options={BUDGET_RANGES} />
                <Select label="Decision timeline" name="decision_timeline" options={DECISION_TIMELINES} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-primary">
                  Goals & questions
                </label>
                <textarea
                  name="goals"
                  required
                  rows={4}
                  minLength={10}
                  maxLength={1500}
                  className="w-full rounded-lg border-2 border-input bg-background p-4 text-text-primary placeholder:text-muted-foreground hover:border-input/80 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 transition-all duration-200 resize-none"
                  placeholder="What do you want to achieve at AIDIFILN 2026?"
                />
              </div>
              {error && (
                <div className="rounded-lg bg-error/10 border border-error/30 p-4">
                  <p className="text-sm font-medium text-error">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full px-7 py-3 rounded-lg text-base font-semibold bg-accent-cyan text-brand-navy hover:bg-accent-cyan/90 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Start the conversation"
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
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
      <label className="block text-sm font-semibold mb-2 text-text-primary">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={255}
        className="w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 text-text-primary placeholder:text-muted-foreground hover:border-input/80 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 transition-all duration-200"
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
      <label className="block text-sm font-semibold mb-2 text-text-primary">{label}</label>
      <select
        name={name}
        required
        defaultValue=""
        className="w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 text-text-primary placeholder:text-muted-foreground hover:border-input/80 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30 transition-all duration-200 cursor-pointer"
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