import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Partners } from "@/components/home/Partners";
import { FAQ } from "@/components/home/FAQ";

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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Schedule
          </h2>
          <p className="text-text-secondary">
            Four days of keynotes, sector tracks, workshops and a closing showcase.
            Detailed agenda coming soon.
          </p>
        </div>
      </section>
      <section
        id="tracks"
        className="scroll-mt-24 py-16 md:py-24 px-6 bg-background text-text-primary"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Sector Tracks
          </h2>
          <p className="text-text-secondary">
            Health · Agriculture · Education · FinTech &amp; Inclusive Finance ·
            Energy &amp; Climate · Governance &amp; Policy · Creative Economy.
          </p>
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
