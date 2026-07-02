import { createHash } from "crypto";
import { normalizeText, shingles } from "./normalize";
import { simhash } from "./simhash";

function sha256hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** Bucket diện tích để gom BĐS gần giống (dung sai 5 m²). */
function bucketArea(area?: number | null): number {
  if (area == null) return 0;
  return Math.round(area / 5) * 5;
}

/** Bucket giá để gom (dung sai 100 triệu). */
function bucketPrice(price: number): number {
  return Math.round(price / 100_000_000) * 100_000_000;
}

export interface FingerprintInput {
  brokerId: string;
  propertyType: string;
  province: string;
  district: string;
  ward?: string | null;
  price: number;
  area?: number | null;
  projectId?: string | null;
  unitTypeId?: string | null;
  description?: string | null;
}

export interface FingerprintResult {
  /** Hard-dupe: cùng broker đăng lại đúng 1 BĐS (chặn spam). */
  dupeKey: string;
  /** SimHash mô tả để phát hiện near-dupe. */
  contentHash: string;
  /** Cluster key gom nhiều broker cùng 1 BĐS (KHÔNG gồm broker). */
  canonicalKey: string;
}

export function computeFingerprint(input: FingerprintInput): FingerprintResult {
  const contentHash = simhash(
    shingles(normalizeText(input.description ?? "")),
  );

  const dupeKey = sha256hex(
    [
      input.brokerId,
      input.propertyType,
      input.province,
      input.district,
      Math.round(input.price),
      Math.round(input.area ?? 0),
    ].join("|"),
  );

  const canonicalKey = input.projectId
    ? sha256hex(
        ["P", input.projectId, input.unitTypeId ?? "", bucketArea(input.area)].join(
          "|",
        ),
      )
    : sha256hex(
        [
          "S",
          input.propertyType,
          input.province,
          input.district,
          normalizeText(input.ward ?? ""),
          bucketArea(input.area),
          bucketPrice(input.price),
        ].join("|"),
      );

  return { dupeKey, contentHash, canonicalKey };
}
