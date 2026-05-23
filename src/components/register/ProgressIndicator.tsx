const labels = ["Type", "Personal", "Track", "Logistics", "Payment"];

export function ProgressIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-between gap-2 mb-8 overflow-x-auto">
      {labels.map((label, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <li key={label} className="flex-1 min-w-[64px]">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                style={{
                  background: isActive || isDone ? "var(--accent-cyan)" : "var(--surface)",
                  color: isActive || isDone ? "var(--brand-navy)" : "var(--text-secondary)",
                  border: `1px solid ${isActive || isDone ? "var(--accent-cyan)" : "var(--border-strong)"}`,
                }}
              >
                {step}
              </div>
              <span
                className="text-xs sm:text-sm hidden sm:inline"
                style={{
                  color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
            {step < labels.length && (
              <div
                className="h-px mt-2"
                style={{ background: isDone ? "var(--accent-cyan)" : "var(--border-strong)" }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}