import { Checkbox } from "@/components/ui/checkbox";
import type { FormState } from "@/lib/register/schema";

export function StepLogistics({
  value,
  errors,
  onChange,
}: {
  value: FormState;
  errors: Record<string, string>;
  onChange: (patch: FormState) => void;
}) {
  return (
    <div className="space-y-5">
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={!!value.accommodation_needed}
          onCheckedChange={(c) => onChange({ accommodation_needed: !!c })}
        />
        <div>
          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
            Accommodation needed
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Request a room at a partner hotel for the duration of the summit.
          </div>
        </div>
      </label>
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={!!value.travel_support_needed}
          onCheckedChange={(c) => onChange({ travel_support_needed: !!c })}
        />
        <div>
          <div className="font-medium" style={{ color: "var(--text-primary)" }}>
            Travel support
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Apply for a travel subsidy if you are travelling from outside Lagos.
          </div>
        </div>
      </label>
    </div>
  );
}