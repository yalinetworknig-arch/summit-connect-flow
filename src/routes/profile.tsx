import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — YALI Network Nigeria" },
      { name: "description", content: "Your registration status and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Profile
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Registration Status + Settings will go here (Prompt 6)
      </p>
    </section>
  );
}