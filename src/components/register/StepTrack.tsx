import { TRACKS } from "@/lib/register/tracks";
import type { FormState } from "@/lib/register/schema";

export function StepTrack({
  value,
  error,
  onChange,
}: {
  value: FormState;
  error?: string;
  onChange: (patch: FormState) => void;
}) {
  return (
    <div className="space-y-3">
      {TRACKS.map((t) => {
        const selected = value.track_selection === t.slug;
        return (
          <button
            key={t.slug}
            type="button"
            onClick={() => onChange({ track_selection: t.slug })}
            className="w-full text-left rounded-xl border p-4 transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              background: selected
                ? "color-mix(in oklab, var(--accent-cyan) 10%, transparent)"
                : "var(--surface)",
              borderColor: selected ? "var(--accent-cyan)" : "var(--border-strong)",
            }}
            aria-pressed={selected}
          >
            <div className="flex items-start gap-3">
              <t.Icon
                className="w-6 h-6 mt-0.5 shrink-0"
                style={{ color: selected ? "var(--accent-cyan)" : "var(--text-secondary)" }}
              />
              <div>
                <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {t.title}
                </div>
                <p
                  className="text-sm mt-1 transition-all"
                  style={{
                    color: "var(--text-secondary)",
                    display: "-webkit-box",
                    WebkitLineClamp: selected ? "unset" : 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: selected ? "visible" : "hidden",
                  }}
                >
                  {t.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
      {error && (
        <p className="text-xs" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}