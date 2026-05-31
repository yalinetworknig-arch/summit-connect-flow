import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyPortal } from "@/lib/portal.functions";
import { ProfileTabs } from "@/components/portal/ProfileTabs";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My profile — AIDIFILN" }] }),
  component: ProfileShell,
});

function ProfileShell() {
  const { session } = useSession();
  const navigate = useNavigate();
  const fetchPortal = useServerFn(getMyPortal);
  const { data, isLoading } = useQuery({
    queryKey: ["my-portal", session?.user.id],
    queryFn: () => fetchPortal({ data: undefined as never }),
    enabled: !!session,
  });

  if (isLoading || !data) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center" style={{ color: "var(--text-secondary)" }}>
        Loading your profile…
      </div>
    );
  }

  if (!data.registration) {
    return (
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
          Link your registration
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          You're signed in but haven't connected your AIDIFILN ticket yet.
        </p>
        <Link
          to="/claim-ticket"
          className="inline-flex items-center justify-center px-6 min-h-12 rounded-full text-sm font-semibold"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          Claim my ticket
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--accent-cyan)" }}>
            AIDIFILN attendee
          </p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
            {data.profile.display_name || data.registration.full_name}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {data.registration.attendee_type} · {data.registration.track_selection ?? "No track yet"}
          </p>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))}
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </header>
      <ProfileTabs />
      <Outlet />
    </section>
  );
}