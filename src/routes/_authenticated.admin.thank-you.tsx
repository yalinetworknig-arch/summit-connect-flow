import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Play, Check, Clock } from "lucide-react";
import { sendThankYouEmailBatch, getThankYouEmailStatus } from "@/lib/tickets.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

export const Route = createFileRoute("/_authenticated/admin/thank-you")({
  head: () => ({ meta: [{ title: "Thank You Emails — Admin" }, { name: "robots", content: "noindex" }] }),
  component: ThankYouEmailPage,
});

function ThankYouEmailPage() {
  const sendBatch = useServerFn(sendThankYouEmailBatch);
  const getStatus = useServerFn(getThankYouEmailStatus);

  const [status, setStatus] = useState<any>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoadStatus() {
    setLoading(true);
    setError(null);
    try {
      const result = await getStatus({ data: {} });
      setStatus(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendBatch() {
    setLoading(true);
    setError(null);
    try {
      const result = await sendBatch({ data: {} });
      setLastResult(result);
      // Reload status
      const newStatus = await getStatus({ data: {} });
      setStatus(newStatus);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send batch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
        💌 Thank You Emails
      </h1>
      <AdminTabs />

      {/* Status Card */}
      <div className="rounded-2xl border p-6 mb-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Campaign Status
          </h2>
          <button
            onClick={handleLoadStatus}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            {loading ? "Loading..." : "Refresh Status"}
          </button>
        </div>

        {status ? (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                  {status.sent} of {status.total} emails sent
                </span>
                <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>
                  {status.percentage}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ background: "var(--border-strong)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ background: "var(--accent-cyan)", width: `${status.percentage}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg p-4" style={{ background: "rgba(34, 197, 94, 0.1)" }}>
                <div style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: "600" }}>SENT</div>
                <div style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
                  {status.sent}
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ background: "rgba(0, 217, 255, 0.1)" }}>
                <div style={{ color: "var(--accent-cyan)", fontSize: "0.75rem", fontWeight: "600" }}>PENDING</div>
                <div style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
                  {status.pending}
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ background: "rgba(107, 114, 128, 0.1)" }}>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: "600" }}>TOTAL</div>
                <div style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
                  {status.total}
                </div>
              </div>
            </div>

            {status.complete && (
              <div
                className="rounded-lg p-4 flex items-center gap-3"
                style={{ background: "rgba(34, 197, 94, 0.1)", borderLeft: "3px solid #22c55e" }}
              >
                <Check className="w-5 h-5" style={{ color: "#22c55e" }} />
                <div>
                  <p style={{ color: "#22c55e", fontWeight: "600" }}>All emails sent!</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Campaign completed successfully.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: "var(--text-secondary)" }}>Click "Refresh Status" to load campaign information.</p>
        )}
      </div>

      {/* Manual Send */}
      {!status?.complete && (
        <div className="rounded-2xl border p-6 mb-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            <Mail className="w-5 h-5 inline mr-2" />
            Send Next Batch
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.875rem" }}>
            Sends 100 emails per batch, prioritizing attendees who checked in first.
          </p>
          <button
            onClick={handleSendBatch}
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition disabled:opacity-50"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            <Play className="w-4 h-4" />
            {loading ? "Sending..." : "Send 100 Emails Now"}
          </button>
        </div>
      )}

      {/* Last Result */}
      {lastResult && (
        <div className="rounded-2xl border p-6 mb-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Last Batch Result
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg p-4" style={{ background: "rgba(34, 197, 94, 0.1)" }}>
              <div style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: "600" }}>SUCCESSFUL</div>
              <div style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
                {lastResult.sent}
              </div>
            </div>
            <div className="rounded-lg p-4" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
              <div style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "600" }}>FAILED</div>
              <div style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
                {lastResult.failed}
              </div>
            </div>
            <div className="rounded-lg p-4" style={{ background: "rgba(107, 114, 128, 0.1)" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: "600" }}>TOTAL</div>
              <div style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
                {lastResult.total}
              </div>
            </div>
          </div>

          {/* Failed List */}
          {lastResult.failed > 0 && (
            <div>
              <h3 style={{ color: "var(--text-primary)", fontWeight: "600", marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                Failed Deliveries:
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lastResult.results
                  .filter((r: any) => !r.success)
                  .map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded p-2 text-xs"
                      style={{ background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5" }}
                    >
                      <strong>{r.name}</strong> ({r.email}) — {r.error}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Info */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
      >
        <div className="flex gap-3">
          <Clock className="w-5 h-5 flex-shrink-0" style={{ color: "var(--accent-cyan)" }} />
          <div>
            <h3 style={{ color: "var(--text-primary)", fontWeight: "600", marginBottom: "0.5rem" }}>
              Automated Daily Sends
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              📅 <strong>When:</strong> Daily at a random time between 8:00 AM and 3:00 PM
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              📧 <strong>Batch Size:</strong> 100 emails per day
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              ⭐ <strong>Priority:</strong> Checked-in attendees first, then others
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              ✅ <strong>Status:</strong> Continues until all emails are sent
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg p-4" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid #ef4444" }}>
          {error}
        </div>
      )}
    </section>
  );
}
