import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function sendMagicLink() {
    if (!email.trim()) {
      setErr("Enter your email first, then tap the magic link button.");
      return;
    }
    setBusy(true);
    setErr(null);
    const target = redirect ?? "/profile";
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}${target}`,
      },
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setMagicSent(true);
  }

  async function sendPasswordReset() {
    if (!email.trim()) {
      setErr("Enter your email above first, then click Forgot password.");
      return;
    }
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setResetSent(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (redirect) { navigate({ to: redirect }); return; }
    try {
      const uid = signInData.user?.id;
      if (uid) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        const list = (roles ?? []).map((r: any) => r.role);
        if (list.includes("admin") || list.includes("staff")) {
          navigate({ to: "/admin" }); return;
        }
      }
    } catch { /* fall through */ }
    navigate({ to: "/profile" });
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Sign in</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Access your attendee profile, ticket and agenda.</p>

      {resetSent && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)" }}>
          ✅ Password reset email sent — check your inbox.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Email</span>
          <input
            type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />
        </label>

        <label className="block text-sm">
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: "var(--text-secondary)" }}>Password</span>
            <button
              type="button"
              onClick={sendPasswordReset}
              disabled={busy}
              className="text-xs underline disabled:opacity-50"
              style={{ color: "var(--accent-cyan)" }}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-transparent pr-10"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
              style={{ color: "var(--text-secondary)" }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>

        {err && <p className="text-sm" style={{ color: "var(--danger, #ef4444)" }}>{err}</p>}

        <button disabled={busy} type="submit" className="w-full px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60" style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="relative my-2 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
          <span className="px-2" style={{ background: "var(--background, transparent)" }}>or</span>
        </div>

        <button
          type="button" onClick={sendMagicLink} disabled={busy}
          className="w-full px-4 py-2.5 rounded-full text-sm font-semibold border disabled:opacity-60"
          style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)", background: "transparent" }}
        >
          {magicSent ? "Magic link sent — check your email" : "Email me a magic sign-in link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
        New attendee? <Link to="/signup" className="font-semibold" style={{ color: "var(--accent-cyan)" }}>Create an account</Link>
      </p>
    </section>
  );
}
