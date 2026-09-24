import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, Mail, Users } from "lucide-react";
import { exportAttendeesEmails } from "@/lib/tickets.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

export const Route = createFileRoute("/_authenticated/admin/emails")({
  head: () => ({ meta: [{ title: "Email Exports — Admin" }, { name: "robots", content: "noindex" }] }),
  component: EmailExportPage,
});

type ExportMode = "physical" | "virtual" | "all";

function EmailExportPage() {
  const exportEmails = useServerFn(exportAttendeesEmails);
  const [selectedMode, setSelectedMode] = useState<ExportMode>("all");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLoadEmails() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await exportEmails({ data: { mode: selectedMode } });
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load emails");
    } finally {
      setLoading(false);
    }
  }

  function downloadCSV() {
    if (!data?.csv) return;

    const modeLabel = selectedMode === "physical" ? "Physical" : selectedMode === "virtual" ? "Virtual" : "All";
    const filename = `attendees-emails-${modeLabel.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;

    const blob = new Blob([data.csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
        📧 Email Exports
      </h1>
      <AdminTabs />

      {/* Selection Section */}
      <div className="rounded-2xl border p-6 mb-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Select Attendee Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Physical */}
          <button
            onClick={() => {
              setSelectedMode("physical");
              setData(null);
            }}
            className="px-6 py-4 rounded-lg border-2 transition text-left"
            style={{
              borderColor: selectedMode === "physical" ? "var(--accent-cyan)" : "var(--border-strong)",
              background: selectedMode === "physical" ? "rgba(0, 217, 255, 0.1)" : "transparent",
            }}
          >
            <div style={{ color: "var(--accent-cyan)", fontWeight: "600", fontSize: "0.875rem" }}>
              👥 PHYSICAL ATTENDEES
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              Venue participants only
            </div>
          </button>

          {/* Virtual */}
          <button
            onClick={() => {
              setSelectedMode("virtual");
              setData(null);
            }}
            className="px-6 py-4 rounded-lg border-2 transition text-left"
            style={{
              borderColor: selectedMode === "virtual" ? "var(--accent-cyan)" : "var(--border-strong)",
              background: selectedMode === "virtual" ? "rgba(0, 217, 255, 0.1)" : "transparent",
            }}
          >
            <div style={{ color: "var(--accent-cyan)", fontWeight: "600", fontSize: "0.875rem" }}>
              🌐 VIRTUAL ATTENDEES
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              Online participants only
            </div>
          </button>

          {/* All */}
          <button
            onClick={() => {
              setSelectedMode("all");
              setData(null);
            }}
            className="px-6 py-4 rounded-lg border-2 transition text-left"
            style={{
              borderColor: selectedMode === "all" ? "var(--accent-cyan)" : "var(--border-strong)",
              background: selectedMode === "all" ? "rgba(0, 217, 255, 0.1)" : "transparent",
            }}
          >
            <div style={{ color: "var(--accent-cyan)", fontWeight: "600", fontSize: "0.875rem" }}>
              📋 ALL ATTENDEES
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              Physical + Virtual combined
            </div>
          </button>
        </div>

        <button
          onClick={handleLoadEmails}
          disabled={loading}
          className="w-full px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          {loading ? "Loading..." : "Load Email List"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg p-4 mb-6" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid #ef4444" }}>
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                <Mail className="w-5 h-5 inline mr-2" />
                {data.count} Verified Emails
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                {selectedMode === "physical" && "Physical attendees ready for venue email"}
                {selectedMode === "virtual" && "Virtual attendees ready for Zoom link"}
                {selectedMode === "all" && "All attendees listed"}
              </p>
            </div>
            <button
              onClick={downloadCSV}
              className="px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition"
              style={{ background: "#22c55e", color: "#000" }}
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>

          {/* Email List Preview */}
          <div className="rounded-lg border overflow-x-auto" style={{ borderColor: "var(--border-strong)" }}>
            <table className="w-full text-sm">
              <thead style={{ color: "var(--text-secondary)" }}>
                <tr className="border-b" style={{ borderColor: "var(--border-strong)" }}>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Ticket Code</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--text-primary)" }}>
                {data.emails.slice(0, 20).map((attendee: any, idx: number) => (
                  <tr key={idx} className="border-b" style={{ borderColor: "var(--border-strong)" }}>
                    <td className="px-4 py-3">{attendee.full_name}</td>
                    <td className="px-4 py-3 text-xs font-mono">{attendee.email}</td>
                    <td className="px-4 py-3 text-xs font-mono">{attendee.ticket_code}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: attendee.attendance_mode === "physical" ? "rgba(34, 197, 94, 0.15)" : "rgba(0, 217, 255, 0.15)",
                          color: attendee.attendance_mode === "physical" ? "#22c55e" : "var(--accent-cyan)",
                        }}
                      >
                        {attendee.attendance_mode === "physical" ? "Physical" : "Virtual"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.emails.length > 20 && (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "1rem", textAlign: "center" }}>
              Showing 20 of {data.count} attendees. Download CSV to see all.
            </p>
          )}

          {/* Info Box */}
          <div
            className="rounded-lg p-4 mt-6"
            style={{ background: "rgba(0, 217, 255, 0.1)", borderLeft: "3px solid var(--accent-cyan)" }}
          >
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              <strong style={{ color: "var(--accent-cyan)" }}>📧 Next Steps:</strong>
            </p>
            <ol style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              <li>1. Download the CSV file</li>
              <li>2. Copy emails into Gmail</li>
              {selectedMode === "virtual" && <li>3. Add Zoom link to welcome email</li>}
              {selectedMode !== "virtual" && <li>3. Customize welcome message</li>}
              <li>{selectedMode === "virtual" ? "4" : "3"}. Send emails</li>
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
