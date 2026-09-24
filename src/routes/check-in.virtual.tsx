import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { checkInVirtual } from "@/lib/tickets.functions";

export const Route = createFileRoute("/check-in/virtual")({
  head: () => ({ meta: [{ title: "Virtual Check-in — YALI Summit" }] }),
  component: VirtualCheckInPage,
});

type Result = {
  alreadyCheckedIn: boolean;
  registration: {
    id: string;
    full_name: string;
    attendee_type: string;
    track_selection: string | null;
    verification_status: string;
    virtual_checked_in_at: string | null;
  };
};

function VirtualCheckInPage() {
  const checkIn = useServerFn(checkInVirtual);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Play success sound
  function playSuccessSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  async function submitCode(ticketCode: string) {
    setError(null);
    setBusy(true);
    setCode("");
    try {
      const r = await checkIn({ data: { code: ticketCode } });
      setResult(r as Result);
      playSuccessSound();
      setTimeout(() => {
        setResult(null);
      }, 5000);
    } catch (e: any) {
      setError(e?.message ?? "Failed to check in");
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  const r = result;
  const status = r?.registration.verification_status ?? "pending";
  const verifiedOk = status === "verified";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)" }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--accent-cyan)" }}>
            🌐 Virtual Attendance
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Confirm your virtual participation in AIDIENGL Summit 2026
          </p>
        </div>

        {/* Check-in Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) submitCode(code.trim());
          }}
          className="rounded-2xl border p-6 mb-6"
          style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
        >
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Enter Your Ticket Code
          </label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., YALI-ABC123"
              className="flex-1 px-4 py-3 rounded-lg border bg-transparent text-base font-mono"
              style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
              autoFocus
            />
            <button
              disabled={busy || !code.trim()}
              className="px-6 py-3 rounded-lg text-base font-semibold disabled:opacity-50 transition"
              style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
            >
              {busy ? "Checking..." : "Join Virtual"}
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-secondary)" }}>
            💡 Your ticket code was in your confirmation email
          </p>
        </form>

        {/* Error Message */}
        {error && (
          <div
            className="rounded-lg p-4 mb-6 text-sm"
            style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}
          >
            ❌ {error}
          </div>
        )}

        {/* Success Confirmation */}
        {r && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-3xl border-2 p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 140, 60, 0.05))",
              borderColor: r.alreadyCheckedIn ? "var(--accent-cyan)" : "#22c55e",
              boxShadow: r.alreadyCheckedIn
                ? "0 0 40px rgba(0, 217, 255, 0.2)"
                : "0 0 40px rgba(34, 197, 94, 0.2)",
            }}
          >
            {/* Animated Checkmark */}
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

            {/* Status Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold mb-1"
              style={{ color: r.alreadyCheckedIn ? "var(--accent-cyan)" : "#22c55e" }}
            >
              {r.alreadyCheckedIn ? "Already Confirmed" : "✓ Confirmed & Registered"}
            </motion.div>

            {/* Attendee Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {r.registration.full_name}
            </motion.div>

            {/* Attendee Details */}
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
            {r.registration.virtual_checked_in_at && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Confirmed at {new Date(r.registration.virtual_checked_in_at).toLocaleTimeString()}
              </motion.div>
            )}

            {/* Verification Status */}
            {!verifiedOk && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 flex items-start gap-2 p-3 rounded-lg text-xs"
                style={{ background: "rgba(234,179,8,0.12)", color: "#fbbf24" }}
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Certificate is <strong>{status}</strong>. YALI delegates verify ID.</span>
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

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              🎥 Check your email for livestream link or access it on this platform
            </motion.div>
          </motion.div>
        )}

        {/* Info Box */}
        {!result && (
          <div
            className="rounded-lg p-4 mt-6"
            style={{ background: "rgba(0, 217, 255, 0.1)", borderLeft: "3px solid var(--accent-cyan)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--accent-cyan)" }}>📱 Virtual Attendance:</strong> Your participation will be recorded and you'll receive a certificate of participation after the event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
