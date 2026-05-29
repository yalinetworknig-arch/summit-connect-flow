import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TRACK_DETAILS } from "@/lib/event-data";

export const Route = createFileRoute("/tracks")({
  head: () => ({
    meta: [
      { title: "Tracks — YALI Summit 2026" },
      { name: "description", content: "Explore the 7 sector tracks at the AIDIFILN Summit 2026." },
      { property: "og:title", content: "Tracks — YALI Summit 2026" },
      { property: "og:description", content: "Explore the 7 sector tracks at the AIDIFILN Summit 2026." },
    ],
  }),
  component: TracksPage,
});

function TracksPage() {
  return (
    <>
      <section className="px-6 py-16 md:py-20 bg-background text-text-primary">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-4">
            Seven sector tracks
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Pick the room you want to shape.
          </h1>
          <p className="text-lg text-text-secondary">
            Every track is curated with founders, policymakers and operators
            who are already moving the needle in that sector.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 md:pb-24 bg-background text-text-primary">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {TRACK_DETAILS.map(({ slug, title, long, sessions, Icon }) => (
            <article
              key={slug}
              className="rounded-2xl border border-border-strong p-6 md:p-8 bg-surface flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-accent-cyan" />
                </span>
                <h2 className="font-display font-semibold text-2xl">{title}</h2>
              </div>
              <p className="text-text-secondary mb-5 leading-relaxed">{long}</p>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                  Sample sessions
                </p>
                <ul className="space-y-1.5 text-text-primary">
                  {sessions.map((s) => (
                    <li key={s} className="text-sm flex gap-2">
                      <span className="text-accent-cyan">▸</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-colors self-start"
              >
                Register for this track
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}