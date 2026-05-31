import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPortal, updateMyProfile } from "@/lib/portal.functions";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/profile/settings")({
  component: SettingsTab,
});

function SettingsTab() {
  const { session } = useSession();
  const fetchPortal = useServerFn(getMyPortal);
  const update = useServerFn(updateMyProfile);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["my-portal", session?.user.id], queryFn: () => fetchPortal(), enabled: !!session });
  const [form, setForm] = useState({ display_name: "", headline: "", bio: "", linkedin_url: "", avatar_url: "", networking_opt_in: true });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (data?.profile) setForm({ display_name: data.profile.display_name ?? "", headline: data.profile.headline ?? "", bio: data.profile.bio ?? "", linkedin_url: data.profile.linkedin_url ?? "", avatar_url: data.profile.avatar_url ?? "", networking_opt_in: data.profile.networking_opt_in });
  }, [data?.profile]);
  const save = useMutation({ mutationFn: () => update({ data: form }), onSuccess: () => { setMsg("Saved."); setErr(null); qc.invalidateQueries({ queryKey: ["my-portal"] }); }, onError: (e: any) => { setMsg(null); setErr(e?.message ?? "Save failed"); } });
  const input = { borderColor: "var(--border-strong)", color: "var(--text-primary)" };
  return (
    <>
    <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="rounded-2xl border p-6 max-w-2xl space-y-4" style={{ borderColor: "var(--border-strong)", background: "var(--card)" }}>
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Profile settings</h2>
      {([["display_name","Display name","input"],["headline","Headline (e.g. Founder, ClimateAI)","input"],["bio","Short bio","textarea"],["linkedin_url","LinkedIn URL","input"],["avatar_url","Avatar image URL","input"]] as const).map(([k,label,kind]) => (
        <label key={k} className="block text-sm">
          <span style={{ color: "var(--text-secondary)" }}>{label}</span>
          {kind === "textarea" ? (
            <textarea rows={3} value={(form as any)[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent" style={input} />
          ) : (
            <input value={(form as any)[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent" style={input} />
          )}
        </label>
      ))}
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={form.networking_opt_in} onChange={(e) => setForm((f) => ({ ...f, networking_opt_in: e.target.checked }))} />
        <span style={{ color: "var(--text-primary)" }}>List me in the attendee directory once I'm checked in</span>
      </label>
      {msg && <p className="text-sm" style={{ color: "#10b981" }}>{msg}</p>}
      {err && <p className="text-sm" style={{ color: "var(--danger, #ef4444)" }}>{err}</p>}
      <button type="submit" disabled={save.isPending} className="px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60" style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}>{save.isPending ? "Saving…" : "Save changes"}</button>
    </form>
    {/* Roadmap teaser: see docs/ROADMAP.md (Phase 3 — State Hubs) */}
    <HubsTeaser homeState={(data?.profile as any)?.home_state ?? null} sectors={((data?.profile as any)?.sectors ?? []) as string[]} />
    </>
  );
}

function HubsTeaser({ homeState, sectors }: { homeState: string | null; sectors: string[] }) {
  return (
    <section className="mt-6 rounded-2xl border p-6 max-w-2xl" style={{ borderColor: "var(--border-strong)", background: "var(--card)" }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Your Hubs & Sectors</h3>
        <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: "var(--surface-muted, rgba(0,0,0,0.05))", color: "var(--text-secondary)" }}>Coming soon</span>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        After the summit, your account becomes your home in the YALI Network Nigeria platform — join State Hubs, tag the sectors you work in, and collaborate across the country.
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>Home state</dt>
          <dd style={{ color: "var(--text-primary)" }}>{homeState ?? <span style={{ color: "var(--text-secondary)" }}>Claim your ticket to set this</span>}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>Sectors</dt>
          <dd style={{ color: "var(--text-primary)" }}>{sectors.length > 0 ? sectors.join(", ") : <span style={{ color: "var(--text-secondary)" }}>None yet</span>}</dd>
        </div>
      </dl>
    </section>
  );
}