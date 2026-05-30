import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Partners } from "@/components/home/Partners";
import { FAQ } from "@/components/home/FAQ";
import { TRACK_DETAILS, SCHEDULE } from "@/lib/event-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YALI Network Nigeria National Summit 2026 — AIDIFILN" },
      {
        name: "description",
        content:
          "AI, Digital Innovation and the Future of Inclusive Leadership in Nigeria. Sept 10–13, 2026, Lagos. Register free.",
      },
      { property: "og:title", content: "YALI Network Nigeria National Summit 2026" },
      {
        property: "og:description",
        content:
          "AI, Digital Innovation and the Future of Inclusive Leadership in Nigeria. Sept 10–13, 2026, Lagos.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <section id="about" className="scroll-mt-24">
        <Stats />
      </section>
      <section
        id="schedule"
        className="scroll-mt-24 py-16 md:py-24 px-6 bg-surface text-text-primary"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-2">
                Sept 10 – 13, 2026
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                Four days. Built to ship outcomes, not slides.
              </h2>
            </div>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-1.5 text-accent-cyan font-semibold hover:gap-2.5 transition-all"
            >
              Full schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEDULE.map((d) => (
              <Link
                to="/schedule"
                key={d.day}
                className="rounded-2xl border border-border-strong bg-background p-5 hover:border-accent-cyan transition-colors group"
              >
                <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">
                  {d.day} · {d.date.split("·")[0].trim()}
                </p>
                <p className="font-display font-semibold text-lg group-hover:text-accent-cyan transition-colors">
                  {d.theme}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section
        id="tracks"
        className="scroll-mt-24 py-16 md:py-24 px-6 bg-background text-text-primary"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-2">
                Seven rooms · Seven decisions
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                Pick the room you want to shape.
              </h2>
              <p className="mt-3 text-text-secondary max-w-xl">
                Each track ends with named commitments — not closing remarks.
              </p>
            </div>
            <Link
              to="/tracks"
              className="inline-flex items-center gap-1.5 text-accent-cyan font-semibold hover:gap-2.5 transition-all"
            >
              Explore all tracks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRACK_DETAILS.map(({ slug, title, short, Icon }) => (
              <Link
                to="/tracks"
                key={slug}
                className="rounded-2xl border border-border-strong bg-surface p-5 hover:border-accent-cyan transition-colors group"
              >
                <span className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-accent-cyan" />
                </span>
                <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-accent-cyan transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-text-secondary">{short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="sponsors" className="scroll-mt-24">
        <Partners />
      </section>
      <section id="contact" className="scroll-mt-24">
        <FAQ />
      </section>
    </>
  );
}
