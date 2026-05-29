import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MapPin, Phone, Check } from "lucide-react";
import { submitContactMessage } from "@/lib/inquiries.functions";
import {
  Reveal,
  SideLabel,
  HalftoneBackdrop,
  Eyebrow,
} from "@/components/motion-primitives";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — YALI Summit 2026" },
      { name: "description", content: "Get in touch with the YALI Network Nigeria team." },
      { property: "og:title", content: "Contact — YALI Summit 2026" },
      { property: "og:description", content: "Get in touch with the YALI Network Nigeria team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitContactMessage);
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
      setError(err instanceof Error ? err.message : "Could not send");
      setStatus("error");
    }
  }

  return (
    <>
      <section className="relative px-6 py-20 md:py-28 bg-background text-text-primary overflow-hidden">
        <HalftoneBackdrop />
        <SideLabel>Reach out · hello@yalinetworknigeria.org</SideLabel>
        <SideLabel side="right" tone="muted">Reply within 2 business days</SideLabel>
        <div className="relative max-w-4xl mx-auto text-center">
          <Reveal><Eyebrow>Get in touch</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display font-bold text-4xl md:text-6xl mt-5 mb-6 leading-[1.05]">
              We'd love to <span className="text-accent-cyan">hear from you.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Questions about registration, sponsorship, media accreditation or
              partnerships? Drop us a note.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-24 md:pb-32 bg-background text-text-primary">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-8">
          <Reveal as="aside" className="space-y-4">
            <InfoCard
              Icon={Mail}
              label="Email"
              value="hello@yalinetworknigeria.org"
              href="mailto:hello@yalinetworknigeria.org"
            />
            <InfoCard
              Icon={Phone}
              label="Phone"
              value="+234 800 000 0000"
              href="tel:+2348000000000"
            />
            <InfoCard
              Icon={MapPin}
              label="Venue"
              value="Lagos, Nigeria · Sept 10–13, 2026"
            />
          </Reveal>

          {status === "ok" ? (
            <div className="rounded-2xl border border-accent-cyan bg-surface p-10 text-center flex flex-col items-center justify-center">
              <Check className="w-10 h-10 text-accent-cyan mb-3" />
              <h3 className="font-display font-semibold text-xl mb-1">
                Message sent
              </h3>
              <p className="text-text-secondary">
                Thanks for reaching out — we'll reply within 2 business days.
              </p>
            </div>
          ) : (
            <Reveal as="form" delay={0.1}>
              <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border-strong bg-surface p-6 md:p-8 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <Field label="Subject" name="subject" required />
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  minLength={10}
                  maxLength={2000}
                  className="w-full rounded-xl border border-border-strong bg-background p-3 text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>
              {error && <p className="text-sm text-error">{error}</p>}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full px-7 py-3 rounded-full text-base font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.01] transition-transform disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Send message"}
              </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

function InfoCard({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="rounded-2xl border border-border-strong bg-surface p-5 flex items-start gap-3 h-full">
      <span className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-accent-cyan" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-widest text-text-secondary">
          {label}
        </p>
        <p className="font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-90 transition-opacity">
      {body}
    </a>
  ) : (
    body
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