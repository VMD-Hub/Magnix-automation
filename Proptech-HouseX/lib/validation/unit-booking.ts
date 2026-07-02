import { z } from "zod";

export const unitBookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "EXPIRED",
  "CANCELLED",
  "CONVERTED_TO_DEPOSIT",
]);

export const unitBookingCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  message: z.string().max(2000).optional(),
});

export const unitBookingAdminStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]),
  cancelReason: z.string().max(500).optional(),
});

export const unitBookingConvertDepositSchema = z.object({
  note: z.string().max(500).optional(),
});

export type UnitBookingCreateInput = z.infer<typeof unitBookingCreateSchema>;
