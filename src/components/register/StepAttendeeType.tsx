import { GraduationCap, Building2, Newspaper, Users, HeartHandshake, type LucideIcon } from "lucide-react";
import type { AttendeeType, FormState } from "@/lib/register/schema";

const options: Array<{ value: AttendeeType; title: string; desc: string; Icon: LucideIcon }> = [
  { value: "delegate", title: "YALI Delegate", desc: "Active YALI Network member with a valid YALI ID.", Icon: GraduationCap },
  { value: "sponsor", title: "Sponsor Representative", desc: "Attending on behalf of a sponsoring organisation.", Icon: Building2 },
  { value: "media", title: "Media", desc: "Press, broadcast, or content creator covering the summit.", Icon: Newspaper },
  { value: "public", title: "General Public", desc: "Open to anyone passionate about Nigeria's digital future.", Icon: Users },
  { value: "volunteer", title: "Volunteer", desc: "Help run the summit on the ground — registration, hospitality, tech, comms.", Icon: HeartHandshake },
];

export function StepAttendeeType({
  value,
  onChange,
}: {
  value: FormState;
  onChange: (patch: FormState) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((o) => {
        const selected = value.attendee_type === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange({ attendee_type: o.value })}
            className="text-left rounded-xl border p-5 transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              background: selected
                ? "color-mix(in oklab, var(--accent-cyan) 10%, transparent)"
                : "var(--surface)",
              borderColor: selected ? "var(--accent-cyan)" : "var(--border-strong)",
            }}
            aria-pressed={selected}
          >
            <o.Icon
              className="w-7 h-7 mb-3"
              style={{ color: selected ? "var(--accent-cyan)" : "var(--text-secondary)" }}
            />
            <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              {o.title}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {o.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}