import { z } from "zod";

export const mediaKindEnum = z.enum(["image", "video"]);

export const mediaInitSchema = z.object({
  kind: mediaKindEnum,
  position: z.number().int().nonnegative().optional(),
  title: z.string().optional(),
  // Ảnh: url đã nằm trên CDN. Video: bỏ trống, sẽ nhận uploadUrl từ provider.
  url: z.string().url().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const mediaWebhookSchema = z.object({
  assetId: z.string().min(1),
  kind: mediaKindEnum.default("video"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSec: z.number().int().positive().optional(),
  playbackUrl: z.string().url().optional(),
});
