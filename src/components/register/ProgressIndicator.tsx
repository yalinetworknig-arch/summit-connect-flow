const labels = ["Type", "Personal", "Track", "Logistics", "Payment"];

export function ProgressIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Registration progress" className="mb-8">
      <ol className="flex items-center">
        {labels.map((label, i) => {
          const step = i + 1;
          const isActive = step === current;
          const isDone = step < current;
          const isLast = step === labels.length;
          return (
            <li key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors"
                  style={{
                    background: isActive || isDone ? "var(--accent-cyan)" : "var(--surface)",
                    color: isActive || isDone ? "var(--brand-navy)" : "var(--text-secondary)",
                    border: `1.5px solid ${isActive || isDone ? "var(--accent-cyan)" : "var(--border-strong)"}`,
                  }}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className="text-[10px] sm:text-xs whitespace-nowrap"
                  style={{
                    color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              </div>
              {/* Connector line between steps */}
              {!isLast && (
                <div
                  className="flex-1 h-px mx-1 sm:mx-2 mb-5 transition-colors"
                  style={{ background: isDone ? "var(--accent-cyan)" : "var(--border-strong)" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}