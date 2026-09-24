import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileCheck, FileX, RotateCcw, Trash2, Mail, AlertCircle, Download } from "lucide-react";
import { z } from "zod";
import { listRegistrations, overrideVerification, getCertificateSignedUrl, deleteRegistration, resendTicketEmail, bulkVerifyPendingRegistrations, exportRegistrationsCSV } from "@/lib/tickets.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

const searchSchema = z.object({
  verification: z.enum(["all", "pending", "verified", "suspicious", "rejected", "error"]).optional(),
  checkedIn: z.enum(["all", "yes", "no"]).optional(),
  attendeeType: z.enum(["all", "delegate", "sponsor", "media", "public", "volunteer"]).optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/admin/registrations")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Registrations — Admin" }, { name: "robots", content: "noindex" }] }),
  component: RegistrationsPage,
});

function StatusPill({ s, model }: { s: string; model?: string | null }) {
  const colors: Record<string, string> = {
    verified: "#22c55e",
    pending: "#eab308",
    suspicious: "#f59e0b",
    rejected: "#ef4444",
    error: "#94a3b8",
  };
  const label = s === "verified" && model === "email-auto-verify" ? "✓ Auto-verified" : s;
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${colors[s] ?? "#94a3b8"}22`, color: colors[s] ?? "#94a3b8" }}>
      {label}
    </span>
  );
}

function RegistrationsPage() {
  const list = useServerFn(listRegistrations);
  const override = useServerFn(overrideVerification);
  const sign = useServerFn(getCertificateSignedUrl);
  const deleteReg = useServerFn(deleteRegistration);
  const resend = useServerFn(resendTicketEmail);
  const bulkVerify = useServerFn(bulkVerifyPendingRegistrations);
  const qc = useQueryClient();
  const initial = Route.useSearch();
  const [verification, setVerification] = useState<"all" | "pending" | "verified" | "suspicious" | "rejected" | "error">(initial.verification ?? "all");
  const [checkedIn, setCheckedIn] = useState<"all" | "yes" | "no">(initial.checkedIn ?? "all");
  const [attendeeType, setAttendeeType] = useState<"all" | "delegate" | "sponsor" | "media" | "public" | "volunteer">(initial.attendeeType ?? "all");
  const [search, setSearch] = useState(initial.search ?? "");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<{ id: string; status: "success" | "error"; message: string } | null>(null);
  const [bulkVerifyModal, setBulkVerifyModal] = useState(false);
  const [bulkVerifyStatus, setBulkVerifyStatus] = useState<"idle" | "confirming" | "loading">("idle");
  const [bulkVerifyResult, setBulkVerifyResult] = useState<{ verified: number; message: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-regs", verification, checkedIn, attendeeType, search],
    queryFn: () => list({ data: { verification, checkedIn, attendeeType: attendeeType === "all" ? undefined : attendeeType, search: search || undefined } }),
  });

  async function openCert(url: string | null) {
    if (!url) return;
    try {
      // url is a storage path: "<bucket>/path" stored in DB? Or full URL? Try as path.
      const path = url.includes("/yali-certificates/") ? url.split("/yali-certificates/")[1] : url;
      const { url: signed } = await sign({ data: { path } });
      window.open(signed, "_blank", "noopener");
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  async function setStatus(id: string, status: "verified" | "rejected" | "pending") {
    await override({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-regs"] });
  }

  async function handleDelete(id: string) {
    try {
      await deleteReg({ data: { id } });
      qc.invalidateQueries({ queryKey: ["admin-regs"] });
      setDeleteConfirm(null);
    } catch (e) {
      alert(`Failed to delete: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  async function handleResendEmail(id: string) {
    setResendingId(id);
    try {
      const result = await resend({ data: { id } });
      setResendStatus({ id, status: "success", message: `Ticket email sent to ${result.email}` });
      setTimeout(() => setResendStatus(null), 3000);
    } catch (e) {
      setResendStatus({ id, status: "error", message: e instanceof Error ? e.message : "Failed to send email" });
      setTimeout(() => setResendStatus(null), 5000);
    } finally {
      setResendingId(null);
    }
  }

  async function handleBulkVerify() {
    setBulkVerifyStatus("loading");
    try {
      const result = await bulkVerify({ data: {} });
      setBulkVerifyResult(result);
      qc.invalidateQueries({ queryKey: ["admin-regs"] });
      setTimeout(() => {
        setBulkVerifyModal(false);
        setBulkVerifyStatus("idle");
        setBulkVerifyResult(null);
      }, 2000);
    } catch (e) {
      setBulkVerifyResult({
        verified: 0,
        message: e instanceof Error ? e.message : "Failed to bulk verify",
      });
      setBulkVerifyStatus("idle");
    }
  }

  const rows = data?.rows ?? [];
  const exportFn = useServerFn(exportRegistrationsCSV);

  async function handleExport(mode: "all" | "physical" | "virtual" = "all") {
    try {
      const { csv } = await exportFn({ data: { mode } });
      if (!csv) {
        alert(`No ${mode === "all" ? "" : mode} registrations to export`);
        return;
      }
      const modeLabel = mode === "all" ? "all" : mode;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `yali-registrations-${modeLabel}-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert(`Export failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <style>{`
        select option {
          background-color: #1a1a2e;
          color: #ffffff;
        }
        select option:checked {
          background-color: #3b82f6;
          color: #ffffff;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Registrations</h1>

      {/* Info banner about auto-verification */}
      <div className="mb-6 p-4 rounded-lg border-l-4" style={{ background: "rgba(34, 197, 94, 0.08)", borderColor: "#22c55e" }}>
        <div className="flex items-start justify-between gap-4">
          <p style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}>
            <strong style={{ color: "#22c55e" }}>✓ Auto-verified registrations:</strong> All new registrations are automatically verified via email. Only review flagged or suspicious entries below.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setBulkVerifyModal(true)}
              className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all"
              style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e", border: "1px solid #22c55e" }}
              title="Verify all pending registrations from before auto-verification was enabled"
            >
              Verify old registrations
            </button>
            <div className="flex gap-1" title="Export registrations as CSV for physical check-in backup">
              <button
                onClick={() => handleExport("physical")}
                className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1"
                style={{ background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", border: "1px solid #3b82f6" }}
              >
                <Download className="w-3 h-3" /> Physical
              </button>
              <button
                onClick={() => handleExport("virtual")}
                className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1"
                style={{ background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", border: "1px solid #3b82f6" }}
              >
                <Download className="w-3 h-3" /> Virtual
              </button>
              <button
                onClick={() => handleExport("all")}
                className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all inline-flex items-center gap-1"
                style={{ background: "rgba(59, 130, 246, 0.2)", color: "#3b82f6", border: "1px solid #3b82f6" }}
              >
                <Download className="w-3 h-3" /> All
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdminTabs />

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div>
          <label className="block text-xs font-semibold mb-2 text-text-secondary">VERIFICATION STATUS</label>
          <select value={verification} onChange={(e) => setVerification(e.target.value as any)} className="px-3 py-2 rounded border bg-transparent text-sm" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}>
            <option value="all">All statuses</option>
            <option value="verified">✓ Auto-verified (email)</option>
            <option value="pending">Pending review</option>
            <option value="suspicious">⚠ Suspicious</option>
            <option value="rejected">✗ Rejected</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2 text-text-secondary">CHECK-IN STATUS</label>
          <select value={checkedIn} onChange={(e) => setCheckedIn(e.target.value as any)} className="px-3 py-2 rounded border bg-transparent text-sm" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}>
            <option value="all">All attendees</option>
            <option value="yes">✓ Checked in</option>
            <option value="no">Not checked in</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 text-text-secondary">ATTENDEE TYPE</label>
          <select value={attendeeType} onChange={(e) => setAttendeeType(e.target.value as any)} className="px-3 py-2 rounded border bg-transparent text-sm" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}>
            <option value="all">All types</option>
            <option value="delegate">YALI Delegate</option>
            <option value="sponsor">Sponsor Representative</option>
            <option value="media">Media</option>
            <option value="public">General Public</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold mb-2 text-text-secondary">SEARCH</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, ticket code…" className="w-full px-3 py-2 rounded border bg-transparent text-sm" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }} />
        </div>
      </div>

      <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--border-strong)", background: "var(--card)" }}>
        <table className="w-full text-sm">
          <thead style={{ color: "var(--text-secondary)" }}>
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">YALI ID</th>
              <th className="px-3 py-2 font-medium">Verification</th>
              <th className="px-3 py-2 font-medium">Check-in</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--text-primary)" }}>
            {isLoading && (<tr><td colSpan={6} className="px-3 py-6 text-center" style={{ color: "var(--text-secondary)" }}>Loading…</td></tr>)}
            {!isLoading && rows.length === 0 && (<tr><td colSpan={6} className="px-3 py-6 text-center" style={{ color: "var(--text-secondary)" }}>No registrations match.</td></tr>)}
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t" style={{ borderColor: "var(--border-strong)" }}>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.full_name}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.email}</div>
                </td>
                <td className="px-3 py-2 capitalize">{r.attendee_type}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.yali_id ?? "—"}</td>
                <td className="px-3 py-2">
                  <StatusPill s={r.verification_status} model={r.verification_model} />
                  {r.verification_reason && <div className="text-xs mt-1 max-w-xs" style={{ color: "var(--text-secondary)" }}>{r.verification_reason}</div>}
                </td>
                <td className="px-3 py-2 text-xs">{r.checked_in_at ? new Date(r.checked_in_at).toLocaleString() : "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {r.yali_certificate_url && (
                      <button onClick={() => openCert(r.yali_certificate_url)} title="View certificate" className="px-2 py-1 rounded border text-xs inline-flex items-center gap-1" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}><ExternalLink className="w-3 h-3" /> Cert</button>
                    )}
                    <a href={`/ticket/${r.ticket_code}`} target="_blank" rel="noopener" className="px-2 py-1 rounded border text-xs inline-flex items-center gap-1" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}><ExternalLink className="w-3 h-3" /> Ticket</a>
                    <button onClick={() => setStatus(r.id, "verified")} className="px-2 py-1 rounded text-xs inline-flex items-center gap-1" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}><FileCheck className="w-3 h-3" /> Verify</button>
                    <button onClick={() => setStatus(r.id, "rejected")} className="px-2 py-1 rounded text-xs inline-flex items-center gap-1" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}><FileX className="w-3 h-3" /> Reject</button>
                    <button onClick={() => setStatus(r.id, "pending")} className="px-2 py-1 rounded text-xs inline-flex items-center gap-1" style={{ background: "rgba(148,163,184,0.15)", color: "var(--text-secondary)" }}><RotateCcw className="w-3 h-3" /> Reset</button>
                    <button onClick={() => handleResendEmail(r.id)} disabled={resendingId === r.id} className="px-2 py-1 rounded text-xs inline-flex items-center gap-1 disabled:opacity-50" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}><Mail className="w-3 h-3" /> {resendingId === r.id ? "Sending..." : "Email"}</button>
                    <button onClick={() => setDeleteConfirm({ id: r.id, name: r.full_name })} className="px-2 py-1 rounded text-xs inline-flex items-center gap-1" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}><Trash2 className="w-3 h-3" /> Delete</button>
                    {resendStatus?.id === r.id && (
                      <div className="text-xs px-2 py-1 rounded" style={{ background: resendStatus.status === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: resendStatus.status === "success" ? "#22c55e" : "#ef4444" }}>
                        {resendStatus.message}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text-primary)" }}>Delete Registration?</h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete the registration for <strong>{deleteConfirm.name}</strong>? This action cannot be undone and will immediately remove this registration from the database.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded text-sm font-medium border" style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 rounded text-sm font-medium" style={{ background: "#ef4444", color: "white" }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Verify Modal */}
      {bulkVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => !bulkVerifyStatus.startsWith('loading') && setBulkVerifyModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid var(--border-strong)" }}>
            {bulkVerifyResult ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="w-6 h-6" style={{ color: bulkVerifyResult.verified > 0 ? "#22c55e" : "#eab308" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {bulkVerifyResult.verified > 0 ? "Verified!" : "Complete"}
                  </h2>
                </div>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  {bulkVerifyResult.message}
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setBulkVerifyModal(false);
                      setBulkVerifyResult(null);
                    }}
                    className="px-4 py-2 rounded text-sm font-medium"
                    style={{ background: "#22c55e", color: "white" }}
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6" style={{ color: "#f59e0b" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    Verify Old Registrations?
                  </h2>
                </div>
                <p className="text-sm mb-2" style={{ color: "var(--text-primary)" }}>
                  This will <strong>verify all pending registrations</strong> from before auto-verification was enabled.
                </p>
                <p className="text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
                  This action cannot be undone. All pending registrations will be marked as verified with audit trail "manual-bulk-verify".
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setBulkVerifyModal(false)}
                    disabled={bulkVerifyStatus === "loading"}
                    className="px-4 py-2 rounded text-sm font-medium border disabled:opacity-50"
                    style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkVerify}
                    disabled={bulkVerifyStatus === "loading"}
                    className="px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                    style={{ background: "#22c55e", color: "white" }}
                  >
                    {bulkVerifyStatus === "loading" ? "Verifying..." : "Yes, Verify All"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}