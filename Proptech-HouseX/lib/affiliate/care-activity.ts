/**
 * Care activity validation — SoT §5.2.
 * CS hợp lệ = enum + note + ≥1 ảnh; Super reject → không reset đồng hồ 30 ngày.
 */

export const CARE_ACTIVITY_TYPES = [
  "CALL",
  "CHAT",
  "MEET",
  "SITE_VISIT",
  "DOCUMENT",
  "OTHER",
] as const;

export type CareActivityTypeCode = (typeof CARE_ACTIVITY_TYPES)[number];

export type CareActivityInput = {
  activityType: string;
  occurredAt: Date;
  note: string;
  imageUrls: string[];
};

export type CareActivityValidation =
  | { ok: true }
  | { ok: false; code: string; message: string };

export function validateCareActivityInput(
  input: CareActivityInput,
): CareActivityValidation {
  if (
    !CARE_ACTIVITY_TYPES.includes(input.activityType as CareActivityTypeCode)
  ) {
    return {
      ok: false,
      code: "INVALID_ACTIVITY_TYPE",
      message: "Loại hoạt động chăm sóc không hợp lệ.",
    };
  }
  const note = input.note?.trim() ?? "";
  if (note.length < 3) {
    return {
      ok: false,
      code: "NOTE_REQUIRED",
      message: "Ghi chú chăm sóc bắt buộc (tối thiểu 3 ký tự).",
    };
  }
  const images = (input.imageUrls ?? []).filter((u) => u.trim().length > 0);
  if (images.length < 1) {
    return {
      ok: false,
      code: "IMAGE_REQUIRED",
      message: "Cần ít nhất 1 ảnh bằng chứng chăm sóc.",
    };
  }
  if (Number.isNaN(input.occurredAt.getTime())) {
    return {
      ok: false,
      code: "INVALID_OCCURRED_AT",
      message: "Thời điểm chăm sóc không hợp lệ.",
    };
  }
  return { ok: true };
}

/** CS được tính vào đồng hồ im 30 ngày. */
export function isValidCareForSilenceClock(activity: {
  status: string;
  note: string;
  imageUrls: string[];
}): boolean {
  if (activity.status === "REJECTED") return false;
  return (
    activity.note.trim().length >= 3 &&
    activity.imageUrls.filter((u) => u.trim()).length >= 1
  );
}
