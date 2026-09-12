import { motion, AnimatePresence } from "framer-motion";
import { SECTORS, ATTENDANCE_MODES } from "@/lib/register/schema";
import type { FormState } from "@/lib/register/schema";
import { staggerContainer, staggerChild, ease, spring } from "@/lib/motion";

const SECTOR_LABELS: Record<string, string> = {
  technology: "Technology & IT",
  education: "Education",
  finance: "Finance & Banking",
  healthcare: "Healthcare",
  government: "Government & Policy",
  agriculture: "Agriculture",
  business: "Business & Entrepreneurship",
  other: "Other",
};

const ATTENDANCE_LABELS: Record<string, string> = {
  physical: "Physical (In-person at venue)",
  virtual: "Virtual (Online participation)",
};

export function StepSectorAttendance({
  value,
  error,
  onChange,
}: {
  value: FormState;
  error?: Record<string, string>;
  onChange: (patch: FormState) => void;
}) {
  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
    >
      {/* Sector Selection */}
      <motion.div variants={staggerChild} className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          What sector are you in?
        </label>
        <select
          value={value.sector || ""}
          onChange={(e) => onChange({ sector: e.target.value as any })}
          className="w-full px-4 py-3 rounded-lg border bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)]"
          style={{
            borderColor: error?.sector ? "var(--error)" : "var(--border-strong)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">Select your sector...</option>
          {SECTORS.map((sector) => (
            <option key={sector} value={sector}>
              {SECTOR_LABELS[sector]}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {error?.sector && (
            <motion.p
              key="sector-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: ease.out }}
              className="text-xs"
              style={{ color: "var(--error)" }}
            >
              {error.sector}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Attendance Mode Selection */}
      <motion.div variants={staggerChild} className="space-y-4">
        <label className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          How will you attend?
        </label>
        <div className="space-y-3">
          {ATTENDANCE_MODES.map((mode) => {
            const selected = value.attendance_mode === mode;
            return (
              <motion.button
                key={mode}
                type="button"
                onClick={() => onChange({ attendance_mode: mode })}
                whileHover={!selected ? { scale: 1.01 } : {}}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left rounded-lg border p-4 transition-[border-color,background] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)]"
                style={{
                  background: selected
                    ? "color-mix(in oklab, var(--accent-cyan) 8%, transparent)"
                    : "var(--surface)",
                  borderColor: selected ? "var(--accent-cyan)" : "var(--border-strong)",
                  boxShadow: selected
                    ? "0 0 0 1px var(--accent-cyan), 0 0 16px color-mix(in oklab, var(--accent-cyan) 12%, transparent)"
                    : "none",
                }}
                aria-pressed={selected}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                    animate={{
                      borderColor: selected ? "var(--accent-cyan)" : "var(--border-strong)",
                      backgroundColor: selected ? "var(--accent-cyan)" : "transparent",
                    }}
                    transition={spring.snappy}
                  >
                    {selected && (
                      <motion.svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="w-3 h-3"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={spring.bouncy}
                      >
                        <path
                          d="M4 8l3 3 5-5"
                          stroke="var(--brand-navy)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                  <motion.div
                    animate={{
                      color: selected ? "var(--accent-cyan)" : "var(--text-primary)",
                    }}
                    transition={spring.gentle}
                    className="font-medium"
                  >
                    {ATTENDANCE_LABELS[mode]}
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {error?.attendance_mode && (
            <motion.p
              key="attendance-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: ease.out }}
              className="text-xs"
              style={{ color: "var(--error)" }}
            >
              {error.attendance_mode}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Virtual attendance note */}
        {value.attendance_mode === "virtual" && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs p-3 rounded-lg"
            style={{
              background: "color-mix(in oklab, var(--accent-cyan) 8%, transparent)",
              color: "var(--text-secondary)",
            }}
          >
            📍 You'll receive a meeting link based on your location/state for participating in the program.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
