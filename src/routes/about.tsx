import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles, Users, MapPin, CalendarDays, Target, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YALI Summit 2026" },
      { name: "description", content: "About the AIDIFILN Summit 2026 by YALI Network Nigeria." },
      { property: "og:title", content: "About — YALI Summit 2026" },
      { property: "og:description", content: "About the AIDIFILN Summit 2026 by YALI Network Nigeria." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="px-6 py-16 md:py-24 bg-background text-text-primary">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-4">
            About the Summit
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-6">
            AI, Digital Innovation & the Future of Inclusive Leadership in Nigeria.
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            AIDIFILN is the flagship national summit of the YALI Network Nigeria —
            four days where Nigerian young leaders, technologists, policymakers and
            sponsors converge to shape what an inclusive AI-powered future looks like
            for our country.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16 bg-surface text-text-primary">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          {[
            { Icon: CalendarDays, label: "Dates", value: "Sept 10 – 13, 2026" },
            { Icon: MapPin, label: "Location", value: "Lagos, Nigeria" },
            { Icon: Users, label: "Delegates", value: "2,000+ expected" },
            { Icon: Globe, label: "Reach", value: "All 36 states + FCT" },
          ].map(({ Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-border-strong p-6 bg-background"
            >
              <Icon className="w-7 h-7 text-accent-cyan mb-3" />
              <p className="text-sm text-text-secondary">{label}</p>
              <p className="text-xl font-display font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 bg-background text-text-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">
            Why AIDIFILN, why now?
          </h2>
          <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
            <p>
              Nigeria is on the cusp of an AI inflection point. Decisions made in
              the next 24 months — about data, infrastructure, talent and
              regulation — will shape the next two decades of inclusive growth.
            </p>
            <p>
              AIDIFILN brings together the people actually building that future:
              founders shipping product, civil servants drafting policy, educators
              reskilling millions, and sponsors funding the pipeline.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 bg-surface text-text-primary">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-10 text-center">
            Theme pillars
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Sparkles,
                title: "Applied AI",
                body: "Beyond demos — real deployments solving Nigerian problems at scale.",
              },
              {
                Icon: Users,
                title: "Inclusive Leadership",
                body: "Women, youth, persons with disabilities, rural communities — leadership that reflects Nigeria.",
              },
              {
                Icon: Target,
                title: "Action over talk",
                body: "Every track ends in commitments, partnerships, and follow-through.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border-strong p-6 bg-background"
              >
                <Icon className="w-8 h-8 text-accent-cyan mb-4" />
                <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
                <p className="text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20 bg-background text-text-primary text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Be part of it.
          </h2>
          <p className="text-text-secondary mb-8">
            Registration is open. Verified YALI delegates attend free.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-7 min-h-12 rounded-full text-base font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.02] transition-transform"
          >
            Register now
          </Link>
        </div>
      </section>
    </>
  );
}