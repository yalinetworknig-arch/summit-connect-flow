import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QRCode from "qrcode";
import { UserPlus, CheckCircle2, Users, Linkedin, MapPin, Ticket, ArrowRight, Pencil, Eye, EyeOff } from "lucide-react";
import { getAttendeeCard, saveContact, getMyConnections, updateMyAttendeeCard } from "@/lib/networking.functions";
import { TRACKS } from "@/lib/register/tracks";

const MY_CODE_KEY = "yali_my_ticket_code";

export const Route = createFileRoute("/attendee/$code")({
  head: () => ({
    meta: [
      { title: "Attendee — YALI Summit 2026" },
      { name: "description", content: "Networking card for YALI Network Nigeria Summit 2026." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AttendeePage,
});

function AttendeePage() {
  const { code } = useParams({ from: "/attendee/$code" });
  const fetchCard = useServerFn(getAttendeeCard);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [myCode, setMyCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      setMyCode(localStorage.getItem(MY_CODE_KEY));
    } catch {}
  }, []);

  // Re-fetches once myCode loads from localStorage (near-instant) so the
  // owner sees their real data even if networking_opt_in is off.
  const { data, isLoading, error } = useQuery({
    queryKey: ["attendee", code, myCode],
    queryFn: () => fetchCard({ data: { code, viewerCode: myCode ?? undefined } }),
    retry: false,
  });

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const url = `${window.location.origin}/attendee/${data.ticket_code}`;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 1,
      color: { dark: "#0A1128", light: "#FFFFFF" },
    });
  }, [data]);

  if (isLoading) {
    return <section className="max-w-2xl mx-auto px-6 py-16 text-center" style={{ color: "var(--text-secondary)" }}>Loading attendee…</section>;
  }

  if (error || !data) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Attendee not found</h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>This networking link doesn't match any registration.</p>
        <Link to="/register" className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}>Register</Link>
      </section>
    );
  }

  const isMe = myCode === data.ticket_code;
  const track = TRACKS.find((t) => t.slug === data.track_selection);

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="rounded-2xl border p-6 sm:p-8 flex flex-col items-center gap-4 mb-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
        <div className="text-xs uppercase tracking-widest self-start" style={{ color: "var(--text-secondary)" }}>
          YALI Summit 2026 · Networking card
        </div>

        {data.profile?.avatar_url ? (
          <img src={data.profile.avatar_url} alt={data.full_name} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}>
            {data.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
        )}

        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>{data.full_name}</div>
          <div className="text-sm capitalize mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {data.attendee_type}{track ? ` · ${track.title}` : ""}
          </div>
          {data.state && (
            <div className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              <MapPin className="w-3 h-3" /> {data.state}
            </div>
          )}
        </div>

        {data.profile?.headline && (
          <p className="text-sm text-center font-medium" style={{ color: "var(--text-primary)" }}>{data.profile.headline}</p>
        )}
        {data.profile?.bio && (
          <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>{data.profile.bio}</p>
        )}
        {data.profile?.linkedin_url && (
          <a href={data.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--accent-cyan)" }}>
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        )}

        <div className="bg-white p-3 rounded-xl mt-2">
          <canvas ref={canvasRef} aria-label="Networking QR code" />
        </div>
        <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
          {isMe ? "Ask people to scan this with their phone camera to save your contact." : "Scan with your phone camera to open this card."}
        </p>
      </div>

      {isMe ? (
        <div className="space-y-6">
          <EditMyCard
            code={data.ticket_code}
            initial={{
              headline: data.profile?.headline ?? "",
              bio: data.profile?.bio ?? "",
              linkedin_url: data.profile?.linkedin_url ?? "",
              avatar_url: data.profile?.avatar_url ?? "",
              networking_opt_in: data.networking_opt_in,
            }}
          />
          <MyConnections code={data.ticket_code} />
        </div>
      ) : (
        <SaveContactCard toCode={data.ticket_code} toName={data.full_name} myCode={myCode} onMyCode={(c) => setMyCode(c)} />
      )}

      {myCode && (
        <div className="mt-6 text-center">
          <Link to="/ticket/$code" params={{ code: myCode }} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--accent-cyan)" }}>
            <Ticket className="w-4 h-4" /> My ticket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}

function EditMyCard({
  code,
  initial,
}: {
  code: string;
  initial: {
    headline: string;
    bio: string;
    linkedin_url: string;
    avatar_url: string;
    networking_opt_in: boolean;
  };
}) {
  const update = useServerFn(updateMyAttendeeCard);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);

  // Keep the form in sync if the fetched card changes underneath us
  // (e.g. right after a save triggers a refetch).
  useEffect(() => {
    setForm(initial);
  }, [initial.headline, initial.bio, initial.linkedin_url, initial.avatar_url, initial.networking_opt_in]);

  const mutation = useMutation({
    mutationFn: () =>
      update({
        data: {
          code,
          headline: form.headline,
          bio: form.bio,
          linkedin_url: form.linkedin_url,
          avatar_url: form.avatar_url,
          networking_opt_in: form.networking_opt_in,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendee"] });
      setOpen(false);
    },
  });

  if (!open) {
    return (
      <div
        className="rounded-2xl border p-5 flex items-center justify-between gap-3"
        style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
      >
        <div>
          <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            Your networking card
          </div>
          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
            {initial.networking_opt_in ? (
              <>
                <Eye className="w-3.5 h-3.5" /> Visible in the attendee directory
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Hidden from the directory — only people you share this link with can see it
              </>
            )}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold active:scale-95 transition-transform"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          Edit your networking card
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setForm(initial);
          }}
          className="text-xs font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          Cancel
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
          Headline
        </label>
        <input
          value={form.headline}
          onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
          placeholder="e.g. Founder, ClimateAI"
          maxLength={160}
          className="w-full px-3 py-2.5 rounded-md border bg-transparent text-sm"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
          Short bio
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={3}
          maxLength={800}
          className="w-full px-3 py-2.5 rounded-md border bg-transparent text-sm resize-none"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
          LinkedIn URL
        </label>
        <input
          value={form.linkedin_url}
          onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))}
          placeholder="https://linkedin.com/in/you"
          className="w-full px-3 py-2.5 rounded-md border bg-transparent text-sm"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
          Avatar image URL
        </label>
        <input
          value={form.avatar_url}
          onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
          placeholder="https://…"
          className="w-full px-3 py-2.5 rounded-md border bg-transparent text-sm"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={form.networking_opt_in}
          onChange={(e) => setForm((f) => ({ ...f, networking_opt_in: e.target.checked }))}
          className="mt-0.5"
        />
        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
          List me in the attendee directory so others can find and connect with me
        </span>
      </label>

      {mutation.isError && (
        <div className="p-3 rounded-md text-sm bg-red-500/10 border border-red-500/30 text-red-400">
          {(mutation.error as Error)?.message ?? "Couldn't save. Try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
        style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
      >
        {mutation.isPending ? "Saving…" : "Save card"}
      </button>
    </form>
  );
}

function SaveContactCard({
  toCode,
  toName,
  myCode,
  onMyCode,
}: {
  toCode: string;
  toName: string;
  myCode: string | null;
  onMyCode: (code: string) => void;
}) {
  const save = useServerFn(saveContact);
  const [input, setInput] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (fromCode: string) => save({ data: { fromCode, toCode } }),
    onSuccess: () => setErr(null),
    onError: (e: any) => setErr(e?.message ?? "Failed to save contact"),
  });

  function handleSave(fromCode: string) {
    const clean = fromCode.trim();
    if (!clean) return;
    try {
      localStorage.setItem(MY_CODE_KEY, clean);
    } catch {}
    onMyCode(clean);
    mutation.mutate(clean);
  }

  if (mutation.isSuccess) {
    const already = (mutation.data as any)?.alreadyConnected;
    return (
      <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--card)", borderColor: "#22c55e" }}>
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: "#22c55e" }} />
        <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
          {already ? `${toName} is already in your contacts` : `Saved ${toName} to your contacts`}
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          You'll both receive each other's contact details by email after the summit.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
      {myCode ? (
        <button
          onClick={() => handleSave(myCode)}
          disabled={mutation.isPending}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          <UserPlus className="w-4 h-4" /> {mutation.isPending ? "Saving…" : `Save ${toName} to my contacts`}
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave(input);
          }}
          className="space-y-3"
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Enter <strong style={{ color: "var(--text-primary)" }}>your own ticket code</strong> (it's on your ticket page) to save this contact:
          </p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your ticket code"
            className="w-full px-3 py-2.5 rounded-md border bg-transparent text-sm font-mono"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            <UserPlus className="w-4 h-4" /> {mutation.isPending ? "Saving…" : "Save contact"}
          </button>
        </form>
      )}
      {err && (
        <div className="mt-3 p-3 rounded-md text-sm bg-red-500/10 border border-red-500/30 text-red-400">{err}</div>
      )}
    </div>
  );
}

function MyConnections({ code }: { code: string }) {
  const fetchConnections = useServerFn(getMyConnections);
  const { data, isLoading } = useQuery({
    queryKey: ["connections", code],
    queryFn: () => fetchConnections({ data: { code } }),
    retry: false,
  });

  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4" style={{ color: "var(--accent-cyan)" }} />
        <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
          My connections{data ? ` (${data.connections.length})` : ""}
        </span>
      </div>
      {isLoading && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</p>}
      {data && data.connections.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No connections yet. When someone scans your QR and saves your contact — or you scan theirs — they'll appear here.
        </p>
      )}
      <ul className="divide-y" style={{ borderColor: "var(--border-strong)" }}>
        {data?.connections.map((c) => (
          <li key={c.ticket_code} className="py-2.5 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.full_name}</div>
              <div className="text-xs capitalize" style={{ color: "var(--text-secondary)" }}>
                {c.attendee_type}{c.state ? ` · ${c.state}` : ""}
              </div>
            </div>
            <Link to="/attendee/$code" params={{ code: c.ticket_code }} className="text-xs font-semibold" style={{ color: "var(--accent-cyan)" }}>
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
