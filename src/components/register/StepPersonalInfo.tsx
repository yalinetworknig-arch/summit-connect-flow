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
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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
        <>
          <Field label="YALI ID" error={errors.yali_id} className="sm:col-span-2">
            <Input
              value={value.yali_id ?? ""}
              onChange={(e) => onChange({ yali_id: e.target.value })}
              maxLength={40}
              placeholder="YALI-NG-XXXXXX"
            />
          </Field>
          <Field
            label="YALI membership certificate (required)"
            error={errors.yali_certificate_url}
            className="sm:col-span-2"
          >
            <CertificateUpload
              value={value.yali_certificate_url ?? ""}
              onChange={(url) => onChange({ yali_certificate_url: url })}
            />
          </Field>
        </>
      )}
    </div>
  );
}

function CertificateUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const MAX_BYTES = 5 * 1024 * 1024;
  const ALLOWED = [
    { mime: "application/pdf", label: "PDF" },
    { mime: "image/png", label: "PNG" },
    { mime: "image/jpeg", label: "JPG" },
  ];

  async function handleFile(file: File) {
    setErr(null);
    setFileName(file.name);
    if (!ALLOWED.some((a) => a.mime === file.type)) {
      setErr(
        `"${file.name}" is a ${file.type || "unknown"} file. Please upload a PDF, PNG, or JPG.`,
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      setErr(`File is ${mb}MB — maximum allowed is 5MB. Please choose a smaller file.`);
      return;
    }
    if (file.size === 0) {
      setErr("This file appears to be empty. Please choose a different file.");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { data: signed, error: signErr } = await supabase.storage
        .from("yali-certificates")
        .createSignedUploadUrl(path);
      if (signErr || !signed) throw signErr ?? new Error("Could not start upload");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signed.signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100);
            resolve();
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });
      onChange(path);
    } catch (e: unknown) {
      setErr(
        e instanceof Error
          ? `Upload failed: ${e.message}. Please try again.`
          : "Upload failed. Please try again.",
      );
      setProgress(0);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        className="text-sm file:mr-3 file:rounded-full file:border-0 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:cursor-pointer"
        style={{
          color: "var(--text-secondary)",
        }}
      />
      {busy && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>Uploading {fileName ? `"${fileName}"` : "file"}…</span>
            <span>{progress}%</span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "var(--border-strong)" }}
          >
            <div
              className="h-full transition-all duration-150"
              style={{ width: `${progress}%`, background: "var(--accent-cyan)" }}
            />
          </div>
        </div>
      )}
      {!busy && value && !err && (
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          ✓ Certificate uploaded successfully{fileName ? ` — ${fileName}` : ""}. You can replace it by choosing another file.
        </span>
      )}
      {err && (
        <span className="text-xs" style={{ color: "var(--error)" }}>
          {err}
        </span>
      )}
      {!value && !busy && !err && (
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Required for delegates. Accepted formats: PDF, PNG, or JPG. Maximum size: 5MB.
        </span>
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