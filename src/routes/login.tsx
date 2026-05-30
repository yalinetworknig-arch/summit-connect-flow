import { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }).parse,
  head: () => ({ meta: [{ title: "Sign in — YALI Summit" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    navigate({ to: redirect ?? "/admin/check-in" });
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Staff sign in</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Access the check-in scanner and admin tools.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
        </label>
        <label className="block text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Password</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
        </label>
        {err && <p className="text-sm" style={{ color: "var(--danger, #ef4444)" }}>{err}</p>}
        <button disabled={busy} type="submit" className="w-full px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60" style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}