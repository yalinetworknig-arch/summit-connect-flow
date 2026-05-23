import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — YALI Summit 2026" },
      { name: "description", content: "Get in touch with the YALI Network Nigeria team." },
      { property: "og:title", content: "Contact — YALI Summit 2026" },
      { property: "og:description", content: "Get in touch with the YALI Network Nigeria team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Contact
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>Contact form will go here.</p>
    </section>
  );
}