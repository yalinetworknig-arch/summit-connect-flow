import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — YALI Summit" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        setBusy(false);
        setErr(error.message);
        return;
      }

      if (!data.user) {
        setBusy(false);
        setErr("Login failed: no user data");
        return;
      }

      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        const roleList = (roles ?? []).map((r: any) => r.role);
        if (roleList.includes("admin") || roleList.includes("staff")) {
          navigate({ to: "/admin" });
          return;
        }
      } catch (e) {
        console.error("Role check failed:", e);
      }

      navigate({ to: "/profile" });
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Login failed");
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      setErr("Enter your email first.");
      return;
    }
    setBusy(true);
    setErr(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setResetSent(true);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
        Sign in
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Access your attendee profile, ticket and agenda.
      </p>

      {resetSent && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          ✓ Password reset email sent. Check your inbox.
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-md border bg-transparent"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <button
              type="button"
              onClick={handlePasswordReset}
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md border bg-transparent pr-10"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
              style={{ color: "var(--text-secondary)" }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {err && (
          <div className="p-3 rounded-md text-sm bg-red-500/10 border border-red-500/30 text-red-400">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
        New attendee?{" "}
        <Link to="/register" className="font-semibold" style={{ color: "var(--accent-cyan)" }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
