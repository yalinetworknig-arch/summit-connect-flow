import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormState } from "@/lib/register/schema";

const HOW_HEARD_OPTIONS = [
  "YALI Network Nigeria",
  "Social media (Instagram, X, Facebook)",
  "WhatsApp group",
  "Friend or colleague",
  "Email newsletter",
  "News article",
  "Other",
] as const;

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
    <div className="space-y-6">
      {/* How did you hear about the summit */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="heard_about_summit" className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          How did you hear about the summit?{" "}
          <span className="font-normal" style={{ color: "var(--text-secondary)" }}>(optional)</span>
        </Label>
        <Select
          value={value.heard_about_summit ?? ""}
          onValueChange={(v) => onChange({ heard_about_summit: v })}
        >
          <SelectTrigger id="heard_about_summit">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {HOW_HEARD_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}