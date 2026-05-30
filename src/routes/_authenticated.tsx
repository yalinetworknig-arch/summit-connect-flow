import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/hooks/use-session";
import { getMyRoles } from "@/lib/tickets.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const router = useRouter();
  const fetchRoles = useServerFn(getMyRoles);

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login", search: { redirect: router.state.location.pathname } });
    }
  }, [loading, session, navigate, router]);

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["my-roles", session?.user.id],
    queryFn: () => fetchRoles({ data: undefined as never }),
    enabled: !!session,
  });

  if (loading || !session || rolesLoading) {
    return <div className="max-w-2xl mx-auto px-6 py-16 text-center" style={{ color: "var(--text-secondary)" }}>Loading…</div>;
  }

  const roles = rolesData?.roles ?? [];
  if (!roles.includes("admin") && !roles.includes("staff")) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Not authorized</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          You're signed in as <strong>{session.user.email}</strong>, but you don't have admin or staff access.
        </p>
        <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))} className="px-5 py-2 rounded-full text-sm font-semibold border" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}>Sign out</button>
      </div>
    );
  }

  return <Outlet />;
}