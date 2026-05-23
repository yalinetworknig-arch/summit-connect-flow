import { z } from "zod";

export const ATTENDEE_TYPES = ["delegate", "sponsor", "media", "public"] as const;
export type AttendeeType = (typeof ATTENDEE_TYPES)[number];

export const step1Schema = z.object({
  attendee_type: z.enum(ATTENDEE_TYPES, {
    message: "Please choose an attendee type",
  }),
});

export const step2Schema = z
  .object({
    full_name: z.string().trim().min(2, "Enter your full name").max(120),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number")
      .max(20)
      .regex(/^[\d+\-\s()]+$/, "Digits, spaces, +, - and () only"),
    state: z.string().min(1, "Select your state").max(40),
    yali_id: z.string().trim().max(40).optional().or(z.literal("")),
    attendee_type: z.enum(ATTENDEE_TYPES),
  })
  .superRefine((val, ctx) => {
    if (val.attendee_type === "delegate" && !val.yali_id?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yali_id"],
        message: "YALI ID is required for delegates",
      });
    }
  });

export const step3Schema = z.object({
  track_selection: z.string().min(1, "Pick a track").max(40),
});

export const step4Schema = z.object({
  accommodation_needed: z.boolean(),
  travel_support_needed: z.boolean(),
  dietary_restrictions: z.string().trim().max(500).optional().or(z.literal("")),
});

export const fullRegistrationSchema = z.object({
  attendee_type: z.enum(ATTENDEE_TYPES),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  state: z.string().min(1).max(40),
  yali_id: z.string().trim().max(40).nullable().optional(),
  track_selection: z.string().min(1).max(40),
  accommodation_needed: z.boolean(),
  travel_support_needed: z.boolean(),
  dietary_restrictions: z.string().trim().max(500).nullable().optional(),
  heard_about_summit: z.string().trim().max(120).nullable().optional(),
  paystack_reference: z.string().trim().max(120).nullable().optional(),
  amount_kobo: z.number().int().nonnegative().nullable().optional(),
  payment_status: z.enum(["pending", "paid", "failed", "free"]).default("pending"),
});

export type FullRegistration = z.infer<typeof fullRegistrationSchema>;

export type FormState = Partial<FullRegistration>;

export const initialFormState: FormState = {
  accommodation_needed: false,
  travel_support_needed: false,
};