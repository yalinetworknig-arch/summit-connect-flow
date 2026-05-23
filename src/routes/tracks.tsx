import { createFileRoute } from "@tanstack/react-router";

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
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Tracks
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>Seven sector tracks will go here.</p>
    </section>
  );
}