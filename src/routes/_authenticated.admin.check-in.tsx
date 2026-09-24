import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, CheckCircle2, AlertTriangle, ShieldCheck, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { checkInTicket } from "@/lib/tickets.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

export const Route = createFileRoute("/_authenticated/admin/check-in")({
  head: () => ({ meta: [{ title: "Check-in scanner — Admin" }, { name: "robots", content: "noindex" }] }),
  component: CheckInPage,
});

type Result = {
  alreadyCheckedIn: boolean;
  registration: {
    id: string;
    full_name: string;
    attendee_type: string;
    track_selection: string | null;
    verification_status: string;
    checked_in_at: string | null;
  };
};

function CheckInPage() {
  const checkIn = useServerFn(checkInTicket);
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const lastScanned = useRef<{ code: string; at: number } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [initializingScanner, setInitializingScanner] = useState(false);

  async function submitCode(code: string) {
    setError(null);
    setBusy(true);
    setManualCode("");
    try {
      const r = await checkIn({ data: { code } });
      setResult(r as Result);
      // Auto-clear result after 4 seconds for next scan
      setTimeout(() => {
        setResult(null);
      }, 4000);
    } catch (e: any) {
      setError(e?.message ?? "Failed to check in");
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!scanning) return;
    let html5: any;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("html5-qrcode");
        if (cancelled) return;

        // Request camera permissions explicitly
        await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

        html5 = new mod.Html5Qrcode("qr-reader");
        await html5.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 250, height: 250 }, disableFlip: false },
          (decoded: string) => {
            const now = Date.now();
            if (lastScanned.current && lastScanned.current.code === decoded && now - lastScanned.current.at < 3000) return;
            lastScanned.current = { code: decoded, at: now };
            submitCode(decoded.trim());
          },
          () => {},
        );
        setError(null);
      } catch (e: any) {
        const errorMsg = e?.message ?? String(e);
        if (errorMsg.includes("Permission denied")) {
          setError("Camera access denied. Please allow camera permissions in browser settings and try again.");
        } else if (errorMsg.includes("NotFoundError")) {
          setError("No camera found. Please connect a camera device.");
        } else {
          setError(`Scanner error: ${errorMsg}`);
        }
        setScanning(false);
      }
    })();
    return () => {
      cancelled = true;
      if (html5) {
        html5.stop().catch(() => {}).then(() => {
          try { html5.clear?.(); } catch (e) {}
        });
      }
    };
  }, [scanning]);

  const r = result;
  const status = r?.registration.verification_status ?? "pending";
  const verifiedOk = status === "verified";

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Check-in</h1>
      <AdminTabs />

      <div className="rounded-2xl border p-4 mb-4" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
        <button
          onClick={() => setScanning((s) => !s)}
          disabled={initializingScanner}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          <Camera className="w-4 h-4" /> {initializingScanner ? "Initializing scanner..." : scanning ? "Stop scanner" : "Start camera scanner"}
        </button>
        {scanning && (
          <div>
            <div id="qr-reader" ref={scannerRef} className="mt-3 mx-auto" style={{ maxWidth: 360, minHeight: 360 }} />
            <p className="text-xs mt-3 text-center" style={{ color: "var(--text-secondary)" }}>
              📱 Point camera at QR code or barcode to check in attendee
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (manualCode.trim()) submitCode(manualCode.trim());
        }}
        className="rounded-2xl border p-4 mb-4 flex gap-2"
        style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
      >
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Enter ticket code"
          className="flex-1 px-3 py-2 rounded-md border bg-transparent text-sm font-mono"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        />
        <button disabled={busy || !manualCode.trim()} className="px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50" style={{ background: "var(--text-primary)", color: "var(--card)" }}>Check in</button>
      </form>

      {error && (
        <div className="rounded-xl border p-4 mb-4 text-sm" style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}>{error}</div>
      )}

      {r && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`rounded-3xl border-2 p-8 text-center ${
            r.alreadyCheckedIn
              ? "bg-gradient-to-br"
              : "bg-gradient-to-br"
          }`}
          style={{
            background: r.alreadyCheckedIn
              ? "linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 150, 180, 0.05))"
              : "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 140, 60, 0.05))",
            borderColor: r.alreadyCheckedIn ? "var(--accent-cyan)" : "#22c55e",
            boxShadow: r.alreadyCheckedIn
              ? "0 0 40px rgba(0, 217, 255, 0.2)"
              : "0 0 40px rgba(34, 197, 94, 0.2)"
          }}
        >
          {/* Animated checkmark */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            {r.alreadyCheckedIn ? (
              <Clock className="w-16 h-16" style={{ color: "var(--accent-cyan)" }} />
            ) : (
              <CheckCircle2 className="w-16 h-16" style={{ color: "#22c55e" }} />
            )}
          </motion.div>

          {/* Status message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold mb-1"
            style={{ color: r.alreadyCheckedIn ? "var(--accent-cyan)" : "#22c55e" }}
          >
            {r.alreadyCheckedIn ? "Already Checked In" : "✓ Confirmed & Checked In"}
          </motion.div>

          {/* Attendee name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {r.registration.full_name}
          </motion.div>

          {/* Attendee details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm capitalize mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {r.registration.attendee_type} · {r.registration.track_selection ?? "no track"}
          </motion.div>

          {/* Time */}
          {r.registration.checked_in_at && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Checked in at {new Date(r.registration.checked_in_at).toLocaleTimeString()}
            </motion.div>
          )}

          {/* Verification status */}
          {!verifiedOk && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-start gap-2 p-3 rounded-lg text-xs"
              style={{ background: "rgba(234,179,8,0.12)", color: "#fbbf24" }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Certificate is <strong>{status}</strong>. Verify YALI ID for access.</span>
            </motion.div>
          )}
          {verifiedOk && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ color: "#22c55e" }}
            >
              <ShieldCheck className="w-5 h-5" /> Certificate Verified ✓
            </motion.div>
          )}

          {/* Next step prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-xs font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            📱 Ready for next attendee
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}