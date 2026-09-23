import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Send, Users, Eye, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import {
  getNetworkingStats,
  sendConnectionEmails,
  resendTicketEmails,
  type SendConnectionEmailsResult,
  type ResendTicketEmailsResult,
} from "@/lib/networking-admin.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

export const Route = createFileRoute("/_authenticated/admin/networking")({
  head: () => ({ meta: [{ title: "Networking — Admin" }, { name: "robots", content: "noindex" }] }),
  component: NetworkingAdminPage,
});

function StatCard({ label, value, Icon }: { label: string; value: number | string; Icon: any }) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
      <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}

function NetworkingAdminPage() {
  const fetchStats = useServerFn(getNetworkingStats);
  const send = useServerFn(sendConnectionEmails);
  const resend = useServerFn(resendTicketEmails);
  const queryClient = useQueryClient();
  const [result, setResult] = useState<SendConnectionEmailsResult | null>(null);
  const [resendResult, setResendResult] = useState<ResendTicketEmailsResult | null>(null);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["networking-stats"],
    queryFn: () => fetchStats({}),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (dryRun: boolean) => send({ data: { dryRun } }),
    onSuccess: (r) => {
      setResult(r as SendConnectionEmailsResult);
      queryClient.invalidateQueries({ queryKey: ["networking-stats"] });
    },
  });

  const resendMutation = useMutation({
    mutationFn: (dryRun: boolean) => resend({ data: { dryRun } }),
    onSuccess: (r) => setResendResult(r as ResendTicketEmailsResult),
  });

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>Networking</h1>
      <AdminTabs />

      {error && (
        <div className="rounded-xl border p-4 mb-4 text-sm" style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}>
          {(error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Connections" value={isLoading ? "…" : stats?.totalConnections ?? 0} Icon={Users} />
        <StatCard label="Profile views" value={isLoading ? "…" : stats?.profileViews ?? 0} Icon={Eye} />
        <StatCard label="Emails pending" value={isLoading ? "…" : stats?.pendingEmails ?? 0} Icon={Mail} />
        <StatCard label="Awaiting resend" value={isLoading ? "…" : stats?.awaitingResend ?? 0} Icon={AlertTriangle} />
      </div>

      <div className="rounded-2xl border p-5 mb-4" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
        <h2 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Contact-exchange emails</h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Sends every attendee one digest email with the contact details of the people they connected with.
          Each connection is marked delivered once both sides have received their digest. Sent in batches of 25 —
          if there are more, click Send again to continue.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => mutation.mutate(true)}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border disabled:opacity-50"
            style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
          >
            <Eye className="w-4 h-4" /> Preview (dry run)
          </button>
          <button
            onClick={() => {
              if (window.confirm("Send contact-exchange emails to all attendees with pending connections?")) {
                mutation.mutate(false);
              }
            }}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            <Send className="w-4 h-4" /> {mutation.isPending ? "Working…" : "Send emails now"}
          </button>
        </div>
      </div>

      {mutation.isError && (
        <div className="rounded-xl border p-4 mb-4 text-sm" style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}>
          {(mutation.error as Error).message}
        </div>
      )}

      <div className="rounded-2xl border p-5 mb-4" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
        <h2 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Resend ticket confirmation email</h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          For registrants whose original email never sent or arrived with encoding issues (anyone registered before
          the delivery + template fixes). Re-sends the current, correct ticket email — including the "Complete your
          networking profile" link. Each registrant is marked once sent, so this only ever reaches people who haven't
          received a corrected email yet.
        </p>
        <p className="text-xs mb-4 p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.1)", color: "var(--text-secondary)" }}>
          📋 <strong>Quota strategy:</strong> You have {isLoading ? "…" : stats?.awaitingResend ?? 0} registrants awaiting resend.
          With 100 emails/day limit, send in batches of 25 (about 1 batch per hour) to stay within your daily quota.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => resendMutation.mutate(true)}
            disabled={resendMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border disabled:opacity-50"
            style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}
          >
            <Eye className="w-4 h-4" /> Preview (dry run)
          </button>
          <button
            onClick={() => {
              if (window.confirm("Send the corrected confirmation email to everyone who hasn't received one yet?")) {
                resendMutation.mutate(false);
              }
            }}
            disabled={resendMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            <RefreshCw className="w-4 h-4" /> {resendMutation.isPending ? "Working…" : "Send emails now"}
          </button>
        </div>

        {resendMutation.isError && (
          <div className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}>
            {(resendMutation.error as Error).message}
          </div>
        )}

        {resendResult && (
          <div
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: resendResult.dryRun ? "var(--accent-cyan)" : "#22c55e", background: "var(--bg)" }}
          >
            <div className="font-semibold mb-2 text-sm" style={{ color: resendResult.dryRun ? "var(--accent-cyan)" : "#22c55e" }}>
              {resendResult.dryRun ? "Dry run — nothing sent" : "Send complete"}
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-primary)" }}>
              <dt style={{ color: "var(--text-secondary)" }}>Total awaiting resend</dt><dd>{resendResult.totalPending}</dd>
              <dt style={{ color: "var(--text-secondary)" }}>Recipients in this batch</dt><dd>{resendResult.recipientsPlanned}</dd>
              {!resendResult.dryRun && (<><dt style={{ color: "var(--text-secondary)" }}>Emails sent</dt><dd>{resendResult.emailsSent}</dd></>)}
              {!resendResult.dryRun && (<><dt style={{ color: "var(--text-secondary)" }}>Emails failed</dt><dd>{resendResult.emailsFailed}</dd></>)}
              <dt style={{ color: "var(--text-secondary)" }}>Remaining after this batch</dt><dd>{resendResult.remainingRecipients}</dd>
            </dl>
            {resendResult.sample.length > 0 && (
              <div className="mt-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                <div className="font-semibold mb-1">Sample of who'd be emailed:</div>
                {resendResult.sample.map((s, i) => <div key={i}>{s.full_name} — {s.email}</div>)}
              </div>
            )}
            {resendResult.errors.length > 0 && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: "rgba(234,179,8,0.12)", color: "#fbbf24" }}>
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>{resendResult.errors.map((e, i) => <div key={i}>{e}</div>)}</div>
              </div>
            )}
            {resendResult.remainingRecipients > 0 && !resendResult.dryRun && (
              <p className="text-xs mt-3" style={{ color: "var(--text-secondary)" }}>
                More recipients remain — click "Send emails now" again to continue.
              </p>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: result.dryRun ? "var(--accent-cyan)" : "#22c55e" }}>
          <div className="font-semibold mb-2" style={{ color: result.dryRun ? "var(--accent-cyan)" : "#22c55e" }}>
            {result.dryRun ? "Dry run — nothing sent" : "Send complete"}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm" style={{ color: "var(--text-primary)" }}>
            <dt style={{ color: "var(--text-secondary)" }}>Pending connections</dt><dd>{result.pendingConnections}</dd>
            <dt style={{ color: "var(--text-secondary)" }}>Recipients in this batch</dt><dd>{result.recipientsPlanned}</dd>
            {!result.dryRun && (<><dt style={{ color: "var(--text-secondary)" }}>Emails sent</dt><dd>{result.emailsSent}</dd></>)}
            {!result.dryRun && (<><dt style={{ color: "var(--text-secondary)" }}>Emails failed</dt><dd>{result.emailsFailed}</dd></>)}
            {!result.dryRun && (<><dt style={{ color: "var(--text-secondary)" }}>Connections marked delivered</dt><dd>{result.connectionsMarked}</dd></>)}
            <dt style={{ color: "var(--text-secondary)" }}>Recipients remaining</dt><dd>{result.remainingRecipients}</dd>
          </dl>
          {result.errors.length > 0 && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: "rgba(234,179,8,0.12)", color: "#fbbf24" }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>{result.errors.map((e, i) => <div key={i}>{e}</div>)}</div>
            </div>
          )}
          {result.remainingRecipients > 0 && !result.dryRun && (
            <p className="text-xs mt-3" style={{ color: "var(--text-secondary)" }}>
              More recipients remain — click "Send emails now" again to continue.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
