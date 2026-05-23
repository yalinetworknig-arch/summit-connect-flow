import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YALI Summit 2026" },
      { name: "description", content: "About the AIDIFILN Summit 2026 by YALI Network Nigeria." },
      { property: "og:title", content: "About — YALI Summit 2026" },
      { property: "og:description", content: "About the AIDIFILN Summit 2026 by YALI Network Nigeria." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        About
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>About the summit content will go here.</p>
    </section>
  );
}