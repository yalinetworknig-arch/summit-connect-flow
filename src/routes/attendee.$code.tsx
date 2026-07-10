import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QRCode from "qrcode";
import { UserPlus, CheckCircle2, Users, Linkedin, MapPin, Ticket, ArrowRight } from "lucide-react";
import { getAttendeeCard, saveContact, getMyConnections } from "@/lib/networking.functions";
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["attendee", code],
    queryFn: () => fetchCard({ data: { code } }),
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
        <MyConnections code={data.ticket_code} />
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
