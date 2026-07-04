import { z } from "zod";
import { LISTING_REPORT_REASONS } from "@/lib/email/listing-report-reasons";

const reasonCodes = Object.keys(LISTING_REPORT_REASONS) as [
  keyof typeof LISTING_REPORT_REASONS,
  ...(keyof typeof LISTING_REPORT_REASONS)[],
];

export const listingReportSchema = z.object({
  reasonCode: z.enum(reasonCodes),
  message: z.string().trim().min(10, "Mô tả tối thiểu 10 ký tự.").max(2000),
  name: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự."),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ."),
  email: z.string().trim().email("Email không hợp lệ.").optional().or(z.literal("")),
});

export type ListingReportInput = z.infer<typeof listingReportSchema>;
