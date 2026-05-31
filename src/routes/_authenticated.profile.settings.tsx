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
  const { data } = useQuery({ queryKey: ["my-portal", session?.user.id], queryFn: () => fetchPortal({ data: undefined as never }), enabled: !!session });
  const [form, setForm] = useState({ display_name: "", headline: "", bio: "", linkedin_url: "", avatar_url: "", networking_opt_in: true });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (data?.profile) setForm({ display_name: data.profile.display_name ?? "", headline: data.profile.headline ?? "", bio: data.profile.bio ?? "", linkedin_url: data.profile.linkedin_url ?? "", avatar_url: data.profile.avatar_url ?? "", networking_opt_in: data.profile.networking_opt_in });
  }, [data?.profile]);
  const save = useMutation({ mutationFn: () => update({ data: form }), onSuccess: () => { setMsg("Saved."); setErr(null); qc.invalidateQueries({ queryKey: ["my-portal"] }); }, onError: (e: any) => { setMsg(null); setErr(e?.message ?? "Save failed"); } });
  const input = { borderColor: "var(--border-strong)", color: "var(--text-primary)" };
  return (
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
  );
}