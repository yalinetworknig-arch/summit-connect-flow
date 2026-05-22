import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — YALI Summit 2026" },
      { name: "description", content: "Four-day Summit programme and agenda." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Schedule
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        4-Day Timeline will go here (Prompt 5)
      </p>
    </section>
  );
}