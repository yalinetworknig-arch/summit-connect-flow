import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitFeedback } from "@/lib/tickets.functions";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Feedback — YALI Summit 2026" }] }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const submit = useServerFn(submitFeedback);
  const [ticketCode, setTicketCode] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [interest, setInterest] = useState<"very_interested" | "somewhat_interested" | "not_interested" | "">("");
  const [stateHub, setStateHub] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!ticketCode) throw new Error("Please enter your ticket code");
      if (!rating) throw new Error("Please rate your experience");
      if (!interest) throw new Error("Please select your interest level");

      await submit({
        data: {
          ticket_code: ticketCode,
          experience_rating: rating,
          join_yali_interest: interest as any,
          preferred_state_hub: stateHub || undefined,
          feedback_text: feedback || undefined,
        },
      });

      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-md w-full rounded-2xl border p-8 text-center" style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}>
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Thank You!
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            We appreciate your feedback! Your insights help us create better experiences for the YALI community.
          </p>
          <p style={{ color: "var(--accent-cyan)", marginTop: "1.5rem", fontSize: "0.875rem" }}>
            📧 Check your email for the next steps.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 sm:px-6 py-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
          📋 Your Feedback Matters
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Help us improve the YALI Summit experience. Your insights guide our future events.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Code */}
          <div>
            <label style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
              Ticket Code
            </label>
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              placeholder="Enter your ticket code"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
              disabled={loading}
            />
          </div>

          {/* Experience Rating */}
          <div>
            <label style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: "600" }}>
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg border-2 transition font-bold text-lg"
                  style={{
                    borderColor: rating === r ? "var(--accent-cyan)" : "var(--border-strong)",
                    background: rating === r ? "rgba(0, 217, 255, 0.1)" : "transparent",
                    color: rating === r ? "var(--accent-cyan)" : "var(--text-secondary)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              1 = Poor, 5 = Excellent
            </p>
          </div>

          {/* Interest in YALI Network */}
          <div>
            <label style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: "600" }}>
              Interest in joining YALI Network?
            </label>
            <div className="space-y-2">
              {[
                { value: "very_interested", label: "🎯 Very interested" },
                { value: "somewhat_interested", label: "👀 Somewhat interested" },
                { value: "not_interested", label: "✋ Not interested" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition" style={{ borderColor: "var(--border-strong)" }}>
                  <input
                    type="radio"
                    name="interest"
                    value={opt.value}
                    checked={interest === opt.value}
                    onChange={(e) => setInterest(e.target.value as any)}
                    disabled={loading}
                  />
                  <span style={{ color: "var(--text-primary)" }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred State Hub */}
          <div>
            <label style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
              Which state hub interests you? (Optional)
            </label>
            <input
              type="text"
              value={stateHub}
              onChange={(e) => setStateHub(e.target.value)}
              placeholder="e.g., Lagos, Abuja, Enugu..."
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
              disabled={loading}
            />
          </div>

          {/* Feedback Text */}
          <div>
            <label style={{ color: "var(--text-primary)", display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
              Additional Comments (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, 1000))}
              placeholder="Share any thoughts, suggestions, or feedback..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border resize-none"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--border-strong)",
                color: "var(--text-primary)",
              }}
              disabled={loading}
            />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {feedback.length}/1000 characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid #ef4444" }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold transition disabled:opacity-50"
            style={{ background: "var(--accent-cyan)", color: "var(--brand-navy)" }}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "2rem", textAlign: "center" }}>
          Your feedback is secure and helps us improve the YALI Summit experience.
        </p>
      </div>
    </section>
  );
}
