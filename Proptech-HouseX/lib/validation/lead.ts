import { z } from "zod";
import { leadSegmentInputSchema } from "@/lib/rules/lead-segment";
import { parseLeadUtmFromRecord } from "@/lib/leads/utm";

const leadUtmSchema = z
  .object({
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
  })
  .optional();

export const leadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "WON",
  "LOST",
]);

// Khách submit form liên hệ. referralId KHÔNG nhận từ client — chỉ suy ra từ
// cookie attribution (rule #3). assignedBrokerId cũng do hệ thống gán.
export const leadCreateSchema = z
  .object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
    message: z.string().optional(),
    customerId: z.string().uuid().optional(),
    listingId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    source: z.string().optional(),
    /** UTM từ landing Zalo Ads / fanpage — object hoặc field phẳng utm_*. */
    utm: leadUtmSchema,
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    /** Intent lane — Mini App gửi `noxh` | `cctm`; server suy ra từ project nếu thiếu. */
    segment: leadSegmentInputSchema.optional(),
    /**
     * ADR-016 — `waitlist` = nhận tin (không cold-call);
     * `consult_request` = xin tư vấn; omit = consult (legacy).
     */
    captureType: z.enum(["waitlist", "consult_request", "hot_manual"]).optional(),
    /** ADR-016 — kênh khách đồng ý; waitlist mặc định server = in_app. */
    channelPreference: z
      .array(z.enum(["in_app", "oa", "sms", "email", "voice_call"]))
      .max(5)
      .optional(),
  })
  .refine((d) => !!d.listingId || !!d.projectId, {
    message: "Lead cần gắn với ít nhất listingId hoặc projectId.",
  })
  .transform((d) => {
    const utm =
      parseLeadUtmFromRecord(d.utm ?? {}) ??
      parseLeadUtmFromRecord({
        utm_source: d.utm_source,
        utm_medium: d.utm_medium,
        utm_campaign: d.utm_campaign,
        utm_content: d.utm_content,
        utm_term: d.utm_term,
      });
    const { utm_source, utm_medium, utm_campaign, utm_content, utm_term, ...rest } =
      d;
    void utm_source;
    void utm_medium;
    void utm_campaign;
    void utm_content;
    void utm_term;
    return { ...rest, utm };
  });

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

const commissionOverrideSchema = z.object({
  amount: z.number().nonnegative().optional(),
  rate: z.number().min(0).max(1).optional(),
  dealValue: z.number().nonnegative().optional(),
  brokerId: z.string().uuid().optional(),
});

export const leadStatusPatchSchema = z.object({
  status: leadStatusEnum,
  // Chỉ dùng khi chuyển sang WON để tạo Commission (rule #4).
  commission: commissionOverrideSchema.optional(),
});

export type CommissionOverride = z.infer<typeof commissionOverrideSchema>;
