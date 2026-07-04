import { listingRemovalEmail, type ListingRemovalEmailInput } from "@/lib/email/listing-removal-template";
import { sendEmail, type SendEmailResult } from "@/lib/email/send";

/** Gửi email thông báo gỡ bỏ / tạm ẩn tin đăng. */
export async function sendListingRemovalEmail(
  input: ListingRemovalEmailInput,
): Promise<SendEmailResult> {
  return sendEmail(listingRemovalEmail(input));
}

export type { ListingRemovalEmailInput } from "@/lib/email/listing-removal-template";
export type { ListingRemovalReasonCode } from "@/lib/email/listing-removal-reasons";
