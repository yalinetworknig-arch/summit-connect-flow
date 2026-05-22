import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Sponsors — YALI Summit 2026" },
      { name: "description", content: "Sponsor portal: deck download and inquiry form." },
    ],
  }),
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Sponsors
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Sponsor portal will go here (Prompt 8)
      </p>
    </section>
  );
}