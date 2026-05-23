import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { CheckCircle2, Calendar, Share2, Home } from "lucide-react";
import { getRegistrationById } from "@/lib/registrations.functions";
import { TRACKS } from "@/lib/register/tracks";

export const Route = createFileRoute("/register/$id")({
  head: () => ({
    meta: [
      { title: "Registration confirmed — YALI Summit 2026" },
      { name: "description", content: "Your ticket for the YALI Network Nigeria Summit 2026." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { id } = useParams({ from: "/register/$id" });
  const fetchReg = useServerFn(getRegistrationById);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [icsUrl, setIcsUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["registration", id],
    queryFn: () => fetchReg({ data: { id } }),
  });

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const payload = JSON.stringify({
      id: data.id,
      ticket: data.ticket_code,
      name: data.full_name,
      url: `${origin}/register/${data.id}`,
    });
    QRCode.toCanvas(canvasRef.current, payload, { width: 220, margin: 1, color: { dark: "#0A1128", light: "#FFFFFF" } });
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const ics = buildIcs(data.full_name);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    setIcsUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [data]);

  if (isLoading) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16 text-center" style={{ color: "var(--text-secondary)" }}>
        Loading your ticket…
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          We couldn't find this registration
        </h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          Please check the link or register again.
        </p>
        <Link
          to="/register"
          className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          Back to registration
        </Link>
      </section>
    );
  }

  const track = TRACKS.find((t) => t.slug === data.track_selection);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/register/${data.id}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `I just registered for YALI Summit 2026! Join me at ${shareUrl}`,
  )}`;

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <div className="flex flex-col items-center text-center mb-8">
        <CheckCircle2 className="w-14 h-14 mb-3" style={{ color: "var(--success)" }} />
        <h1
          className="font-bold"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "var(--text-primary)",
          }}
        >
          You're in, {data.full_name.split(" ")[0]}!
        </h1>
        <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
          Your registration for AIDIFILN 2026 is confirmed.
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 sm:p-8 flex flex-col items-center gap-4 mb-6"
        style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
      >
        <div className="bg-white p-3 rounded-xl">
          <canvas ref={canvasRef} aria-label="Ticket QR code" />
        </div>
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
            Ticket code
          </div>
          <div className="font-mono text-sm break-all mt-1" style={{ color: "var(--text-primary)" }}>
            {data.ticket_code}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 w-full text-sm mt-2">
          <div>
            <dt style={{ color: "var(--text-secondary)" }}>Track</dt>
            <dd className="font-medium" style={{ color: "var(--text-primary)" }}>
              {track?.title ?? data.track_selection}
            </dd>
          </div>
          <div>
            <dt style={{ color: "var(--text-secondary)" }}>Attendee type</dt>
            <dd className="font-medium capitalize" style={{ color: "var(--text-primary)" }}>
              {data.attendee_type}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {icsUrl && (
          <a
            href={icsUrl}
            download="yali-summit-2026.ics"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-colors"
            style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
          >
            <Calendar className="w-4 h-4" /> Add to calendar
          </a>
        )}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
          style={{ background: "var(--success)", color: "#FFFFFF" }}
        >
          <Share2 className="w-4 h-4" /> Share on WhatsApp
        </a>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        >
          <Home className="w-4 h-4" /> Home
        </Link>
      </div>
    </section>
  );
}

function buildIcs(name: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YALI Network Nigeria//Summit 2026//EN",
    "BEGIN:VEVENT",
    `UID:yali-summit-2026-${Date.now()}@yalinetwork.ng`,
    `DTSTAMP:${stamp}`,
    "DTSTART:20260911T080000",
    "DTEND:20260914T180000",
    "SUMMARY:YALI Network Nigeria National Summit (AIDIFILN) 2026",
    `DESCRIPTION:Registered as ${name}. AI\\, Digital Innovation and the Future of Inclusive Leadership in Nigeria.`,
    "LOCATION:Eko Convention Centre, Victoria Island, Lagos, Nigeria",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}