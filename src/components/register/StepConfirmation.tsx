import { motion } from "framer-motion";
import { Check, Mail, Calendar, User } from "lucide-react";
import type { FormState } from "@/lib/register/schema";

export function StepConfirmation({ value }: { value: FormState }) {
  return (
    <div className="space-y-6">
      {/* Success message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--accent-cyan)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Check className="w-8 h-8" style={{ color: "var(--brand-navy)" }} />
        </motion.div>

        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Registration Complete!
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Thank you for registering for AIDIENGL 2026. A confirmation email has been sent to your registered email address.
        </p>
      </motion.div>

      {/* Registration summary */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div
          className="rounded-lg p-4 flex items-start gap-3"
          style={{ background: "var(--surface)" }}
        >
          <User className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--accent-cyan)" }} />
          <div className="flex-1">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Attendee Type
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {value.attendee_type?.replace(/_/g, " ").toUpperCase()}
            </p>
          </div>
        </div>

        <div
          className="rounded-lg p-4 flex items-start gap-3"
          style={{ background: "var(--surface)" }}
        >
          <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--accent-cyan)" }} />
          <div className="flex-1">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Confirmation Email
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {value.email}
            </p>
          </div>
        </div>

        <div
          className="rounded-lg p-4 flex items-start gap-3"
          style={{ background: "var(--surface)" }}
        >
          <Calendar className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--accent-cyan)" }} />
          <div className="flex-1">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Event Date
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Friday, September 25, 2026
            </p>
          </div>
        </div>
      </motion.div>

      {/* Next steps */}
      <motion.div
        className="rounded-lg border-2 p-4"
        style={{ borderColor: "var(--border-strong)", background: "var(--card)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3
          className="font-semibold mb-3 text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          What's Next?
        </h3>
        <ul
          className="space-y-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <li className="flex gap-2">
            <span style={{ color: "var(--accent-cyan)" }}>•</span>
            <span>Check your email for the confirmation message with event details</span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: "var(--accent-cyan)" }}>•</span>
            <span>Add the event to your calendar for September 25, 2026</span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: "var(--accent-cyan)" }}>•</span>
            <span>Join our Network page to connect with other attendees</span>
          </li>
          <li className="flex gap-2">
            <span style={{ color: "var(--accent-cyan)" }}>•</span>
            <span>Follow YALI Network Nigeria for updates and announcements</span>
          </li>
        </ul>
      </motion.div>

      {/* CTA to home or network page */}
      <motion.div
        className="text-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <p
          className="text-xs mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          You can now explore the summit and connect with other attendees
        </p>
      </motion.div>
    </div>
  );
}
