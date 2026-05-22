import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — YALI Summit 2026" },
      { name: "description", content: "Free registration for YALI Summit 2026." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Register
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Multi-step registration flow will go here (Prompt 7)
      </p>
    </section>
  );
}