import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/summit")({
  head: () => ({
    meta: [
      { title: "Summit — YALI Network Nigeria" },
      { name: "description", content: "AIDIFILN: AI, Digital Innovation and the Future of Inclusive Leadership in Nigeria." },
    ],
  }),
  component: SummitPage,
});

function SummitPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Summit
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Tracks, Speakers, FAQs will go here (Prompt 4)
      </p>
    </section>
  );
}