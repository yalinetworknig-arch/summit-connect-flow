import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({ redirect: z.string().optional() }).parse,
  head: () => ({
    meta: [
      { title: "Create your AIDIFILN account" },
      { name: "description", content: "Sign up to access your ticket, agenda, hackathon entry and networking." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/signup" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/claim-ticket` },
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: redirect ?? "/claim-ticket" });
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
          Check your email
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to finish creating your account.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
        Create your attendee account
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Use the same email you registered with so you can claim your ticket.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />
        </label>
        <label className="block text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Password (min. 8 characters)</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />
        </label>
        {err && (
          <p className="text-sm" style={{ color: "var(--danger, #ef4444)" }}>
            {err}
          </p>
        )}
        <button
          disabled={busy}
          type="submit"
          className="w-full px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link to="/login" className="font-semibold" style={{ color: "var(--accent-cyan)" }}>
          Sign in
        </Link>
      </p>
    </section>
  );
}