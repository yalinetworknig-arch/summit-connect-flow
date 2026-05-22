import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Network — YALI Network Nigeria" },
      { name: "description", content: "Member directory — coming in Phase 2." },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Network
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Coming Soon — Member Directory (Phase 2)
      </p>
    </section>
  );
}