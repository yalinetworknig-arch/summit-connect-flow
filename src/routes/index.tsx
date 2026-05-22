import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — YALI Network Nigeria" },
      { name: "description", content: "Welcome to YALI Network Nigeria. Register free for Summit 2026." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Home
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Hero, Stats, Partner Logos will go here (Prompt 3)
      </p>
    </section>
  );
}
