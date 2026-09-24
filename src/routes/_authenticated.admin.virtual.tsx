import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Download, Check } from "lucide-react";
import { listVirtualAttendees, markVirtualAttendance, getVirtualCheckInStats } from "@/lib/tickets.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

export const Route = createFileRoute("/_authenticated/admin/virtual")({
  head: () => ({ meta: [{ title: "Virtual Attendance — Admin" }, { name: "robots", content: "noindex" }] }),
  component: VirtualAttendancePage,
});

function VirtualAttendancePage() {
  const listAttendees = useServerFn(listVirtualAttendees);
  const markAttendance = useServerFn(markVirtualAttendance);
  const fetchStats = useServerFn(getVirtualCheckInStats);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");

  const { data: stats } = useQuery({
    queryKey: ["virtual-stats"],
    queryFn: () => fetchStats({ data: {} }),
    refetchInterval: 5000,
  });

  const { data } = useQuery({
    queryKey: ["virtual-attendees"],
    queryFn: () => listAttendees({ data: {} }),
  });

  const rows = data?.attendees ?? [];

  const filtered = rows.filter((r: any) => {
    const matchesSearch = search === "" ||
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.ticket_code.includes(search.toUpperCase());

    if (filter === "confirmed") return matchesSearch && r.virtual_checked_in_at;
    if (filter === "pending") return matchesSearch && !r.virtual_checked_in_at;
    return matchesSearch;
  });

  async function handleMarkAttendance(id: string) {
    try {
      await markAttendance({ data: { id } });
      qc.invalidateQueries({ queryKey: ["virtual-attendees"] });
      qc.invalidateQueries({ queryKey: ["virtual-stats"] });
    } catch (e) {
      alert(`Failed to mark attendance: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Ticket Code", "Type", "Track", "Status", "Check-in Time"];
    const csvRows = filtered.map((r: any) => [
      `"${r.full_name}"`,
      r.email,
      r.ticket_code,
      r.attendee_type,
      r.track_selection || "—",
      r.virtual_checked_in_at ? "Confirmed" : "Pending",
      r.virtual_checked_in_at ? new Date(r.virtual_checked_in_at).toLocaleString() : "—",
    ]);
    const csv = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `virtual-attendance-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
        Virtual Attendance
      </h1>
      <AdminTabs />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg p-4 text-center" style={{ background: "rgba(34, 197, 94, 0.1)", borderLeft: "3px solid #22c55e" }}>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{stats?.virtualCheckedIn ?? 0}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Confirmed Virtual</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ background: "rgba(59, 130, 246, 0.1)", borderLeft: "3px solid #3b82f6" }}>
          <div className="text-2xl font-bold" style={{ color: "#3b82f6" }}>{stats?.pending ?? 0}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Pending</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ background: "rgba(0, 217, 255, 0.1)", borderLeft: "3px solid var(--accent-cyan)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--accent-cyan)" }}>{stats?.total ?? 0}</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Total</div>
        </div>
        <div className="rounded-lg p-4 text-center" style={{ background: "rgba(34, 197, 94, 0.1)", borderLeft: "3px solid #22c55e" }}>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{stats?.percentage ?? 0}%</div>
          <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Confirmed</div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div>
          <label className="block text-xs font-semibold mb-2 text-text-secondary">STATUS</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 rounded border bg-transparent text-sm"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            <option value="all">All attendees</option>
            <option value="confirmed">✓ Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold mb-2 text-text-secondary">SEARCH</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, ticket…"
            className="w-full px-3 py-2 rounded border bg-transparent text-sm"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 mt-6"
          style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: "var(--border-strong)", background: "var(--card)" }}>
        <table className="w-full text-sm">
          <thead style={{ color: "var(--text-secondary)" }}>
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Check-in Time</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--text-primary)" }}>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center" style={{ color: "var(--text-secondary)" }}>
                  No attendees match your search.
                </td>
              </tr>
            )}
            {filtered.map((r: any) => (
              <tr key={r.id} className="border-t" style={{ borderColor: "var(--border-strong)" }}>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.full_name}</div>
                </td>
                <td className="px-3 py-2 text-xs">{r.email}</td>
                <td className="px-3 py-2 capitalize text-xs">{r.attendee_type}</td>
                <td className="px-3 py-2">
                  {r.virtual_checked_in_at ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>
                      <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
                      ⏳ Pending
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">
                  {r.virtual_checked_in_at ? new Date(r.virtual_checked_in_at).toLocaleString() : "—"}
                </td>
                <td className="px-3 py-2">
                  {!r.virtual_checked_in_at && (
                    <button
                      onClick={() => handleMarkAttendance(r.id)}
                      className="px-3 py-1 rounded text-xs inline-flex items-center gap-1 font-medium"
                      style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}
                    >
                      <Check className="w-3 h-3" /> Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
