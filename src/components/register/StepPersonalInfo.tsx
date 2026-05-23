import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIGERIAN_STATES } from "@/lib/register/states";
import type { FormState } from "@/lib/register/schema";

export function StepPersonalInfo({
  value,
  errors,
  onChange,
}: {
  value: FormState;
  errors: Record<string, string>;
  onChange: (patch: FormState) => void;
}) {
  const isDelegate = value.attendee_type === "delegate";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Full name" error={errors.full_name}>
        <Input
          value={value.full_name ?? ""}
          onChange={(e) => onChange({ full_name: e.target.value })}
          maxLength={120}
          placeholder="Chinwe Okafor"
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <Input
          type="email"
          value={value.email ?? ""}
          onChange={(e) => onChange({ email: e.target.value })}
          maxLength={255}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Phone" error={errors.phone}>
        <Input
          type="tel"
          value={value.phone ?? ""}
          onChange={(e) => onChange({ phone: e.target.value })}
          maxLength={20}
          placeholder="+234 800 000 0000"
        />
      </Field>
      <Field label="State" error={errors.state}>
        <Select value={value.state ?? ""} onValueChange={(v) => onChange({ state: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      {isDelegate && (
        <Field label="YALI ID" error={errors.yali_id} className="sm:col-span-2">
          <Input
            value={value.yali_id ?? ""}
            onChange={(e) => onChange({ yali_id: e.target.value })}
            maxLength={40}
            placeholder="YALI-NG-XXXXXX"
          />
        </Field>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label className="text-sm" style={{ color: "var(--text-primary)" }}>
        {label}
      </Label>
      {children}
      {error && (
        <span className="text-xs" style={{ color: "var(--error)" }}>
          {error}
        </span>
      )}
    </div>
  );
}