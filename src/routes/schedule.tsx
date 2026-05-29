import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SCHEDULE } from "@/lib/event-data";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — YALI Summit 2026" },
      { name: "description", content: "Four-day Summit programme and agenda." },
      { property: "og:title", content: "Schedule — YALI Summit 2026" },
      { property: "og:description", content: "Four-day Summit programme and agenda." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [active, setActive] = useState(0);
  const day = SCHEDULE[active];
  return (
    <>
      <section className="px-6 py-16 md:py-20 bg-background text-text-primary">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-4">
            Four days · Sept 10–13, 2026
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
            The full programme.
          </h1>
          <p className="text-lg text-text-secondary">
            Keynotes, parallel sector tracks, hands-on workshops, a hackathon,
            and a closing showcase. Detailed speaker lineups land closer to event.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20 md:pb-28 bg-background text-text-primary">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {SCHEDULE.map((d, i) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                  i === active
                    ? "bg-accent-cyan text-brand-navy border-accent-cyan"
                    : "border-border-strong text-text-primary hover:bg-surface"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border-strong bg-surface p-6 md:p-10">
            <div className="mb-8">
              <p className="text-sm text-text-secondary">{day.date}</p>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-1">
                {day.theme}
              </h2>
            </div>
            <ol className="space-y-4">
              {day.blocks.map((b) => (
                <li
                  key={b.title}
                  className="rounded-xl border border-border-strong bg-background p-5 md:p-6 grid md:grid-cols-[180px_1fr] gap-3 md:gap-6"
                >
                  <div className="text-accent-cyan font-mono font-semibold text-sm md:text-base">
                    {b.time}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">
                      {b.title}
                    </h3>
                    <p className="text-text-secondary">{b.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-7 min-h-12 rounded-full text-base font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.02] transition-transform"
            >
              Reserve your seat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}