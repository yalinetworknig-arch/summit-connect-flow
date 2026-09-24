import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import { sendWhatsAppBulkMessage, getWhatsAppBulkPreview } from "@/lib/tickets.functions";
import { AdminTabs } from "@/components/admin/AdminTabs";

export const Route = createFileRoute("/_authenticated/admin/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp Messages — Admin" }, { name: "robots", content: "noindex" }] }),
  component: WhatsAppPage,
});

type RecipientType = "all" | "physical" | "virtual";

const TEMPLATES = {
  few_hours_to_go: {
    title: "Few Hours to Go",
    message: "🎉 Hello {{name}},\n\nThe YALI Summit 2026 starts in just a few hours! 🚀\n\n📍 Venue: TBD\n⏰ Opening ceremony at 8:00 AM\n\nDon't miss it! See you there! 🌟",
  },
  virtual_livestream: {
    title: "Virtual Livestream Link",
    message: "🌐 Hello {{name}},\n\nYou're registered for virtual attendance at the YALI Summit 2026! 🎥\n\n📺 Join the livestream: [LINK]\n⏰ Event starts at 8:00 AM (WAT)\n\nLooking forward to seeing you online! 💻",
  },
  day_of_reminder: {
    title: "Good Morning - Event Today",
    message: "🌅 Good morning {{name}}!\n\nToday's the day! The YALI Summit 2026 is happening NOW 🎉\n\n📍 Venue doors are open\n🎟️ Your ticket code will get you in\n\nSee you soon! 🚀",
  },
};

function WhatsAppPage() {
  const sendBulk = useServerFn(sendWhatsAppBulkMessage);
  const getPreview = useServerFn(getWhatsAppBulkPreview);

  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("few_hours_to_go");
  const [message, setMessage] = useState(TEMPLATES.few_hours_to_go.message);
  const [recipientType, setRecipientType] = useState<RecipientType>("all");
  const [preview, setPreview] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePreview() {
    try {
      setError(null);
      const p = await getPreview({ data: { recipientType } });
      setPreview(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load preview");
    }
  }

  async function handleSend() {
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    if (!preview) {
      setError("Load preview first to confirm recipients");
      return;
    }

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const res = await sendBulk({ data: { message, recipientType } });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send messages");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
        📱 WhatsApp Messages
      </h1>
      <AdminTabs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selector */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Select Template
          </h2>

          <div className="space-y-2 mb-6">
            {Object.entries(TEMPLATES).map(([key, { title }]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedTemplate(key as keyof typeof TEMPLATES);
                  setMessage(TEMPLATES[key as keyof typeof TEMPLATES].message);
                }}
                className="w-full px-4 py-3 rounded-lg text-left transition"
                style={{
                  background: selectedTemplate === key ? "var(--accent-cyan)" : "transparent",
                  color: selectedTemplate === key ? "var(--brand-navy)" : "var(--text-primary)",
                  border: `1px solid ${selectedTemplate === key ? "var(--accent-cyan)" : "var(--border-strong)"}`,
                }}
              >
                {title}
              </button>
            ))}
          </div>

          {/* Recipient Type */}
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            SEND TO
          </h3>
          <div className="space-y-2">
            {(["all", "physical", "virtual"] as RecipientType[]).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recipient"
                  value={type}
                  checked={recipientType === type}
                  onChange={(e) => setRecipientType(e.target.value as RecipientType)}
                  className="w-4 h-4"
                />
                <span style={{ color: "var(--text-primary)" }}>
                  {type === "all" && "All Attendees"}
                  {type === "physical" && "Physical Attendees Only"}
                  {type === "virtual" && "Virtual Attendees Only"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Message Preview
          </h2>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm mb-4 resize-none"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          />

          <div className="text-xs p-3 rounded-lg mb-4" style={{ background: "rgba(0, 217, 255, 0.1)", color: "var(--accent-cyan)" }}>
            💡 Tip: Use {{name}} to personalize messages with attendee names
          </div>

          <button
            onClick={handlePreview}
            className="w-full px-4 py-2 rounded-lg font-semibold transition"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            Load Preview
          </button>
        </div>
      </div>

      {/* Preview Results */}
      {preview && (
        <div className="mt-6 rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            📊 Recipients: {preview.totalRecipients}
          </h2>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
            {preview.preview.map((item: any, idx: number) => (
              <div
                key={idx}
                className="px-3 py-2 rounded text-sm flex justify-between"
                style={{ background: "rgba(0, 217, 255, 0.1)" }}
              >
                <span style={{ color: "var(--text-primary)" }}>{item.name}</span>
                <span style={{ color: "var(--text-secondary)" }}>{item.phone}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full px-4 py-3 rounded-lg font-semibold transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#22c55e", color: "#000" }}
          >
            {sending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {preview.totalRecipients} Attendees
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-6 rounded-lg p-4" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid #ef4444" }}>
          ❌ {error}
        </div>
      )}

      {/* Send Results */}
      {result && (
        <div className="mt-6 rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <div className="flex items-start gap-4 mb-6">
            {result.failed === 0 ? (
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" style={{ color: "#22c55e" }} />
            ) : (
              <AlertTriangle className="w-8 h-8 flex-shrink-0" style={{ color: "#f59e0b" }} />
            )}
            <div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {result.failed === 0 ? "✓ All Messages Sent!" : "⚠️ Partial Send"}
              </h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                {result.sent} sent, {result.failed} failed out of {result.total}
              </p>
            </div>
          </div>

          {result.failed > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "600" }}>
                Failed deliveries:
              </p>
              {result.results
                .filter((r: any) => !r.success)
                .map((r: any, idx: number) => (
                  <div
                    key={idx}
                    className="px-3 py-2 rounded text-sm"
                    style={{ background: "rgba(239,68,68,0.1)" }}
                  >
                    <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>{r.name}</div>
                    <div style={{ color: "#fca5a5", fontSize: "0.75rem", marginTop: "0.25rem" }}>{r.error}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
