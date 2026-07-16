import { z } from "zod";

/** Landing page dự án — lưu trong `Project.overviewData.landing` (version 1). */
export const projectLandingBlockSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

export const projectLandingFaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

/**
 * URL ảnh landing: chấp nhận URL tuyệt đối (http/https) HOẶC đường dẫn /public
 * bắt đầu bằng "/" (ảnh đã nội bộ hóa trong repo). Trước đây chỉ nhận `.url()`
 * nên ảnh local bị zod loại bỏ → cả landing bị drop (mất ảnh + text).
 */
const landingImageUrlSchema = z
  .string()
  .min(1)
  .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/"), {
    message: "URL ảnh phải là http(s) hoặc đường dẫn /public bắt đầu bằng '/'",
  });

export const projectLandingGallerySchema = z.object({
  url: landingImageUrlSchema,
  caption: z.string().optional(),
});

/** Dịch vụ HouseX đồng hành — mô hình hành trình trọn vòng đời (NOXH). */
export const projectLandingServiceSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  href: z.string().optional(),
});

/** Một ảnh bản đồ / minh hoạ khoảng cách — hiển thị cạnh nội dung text vị trí. */
export const projectLandingLocationMapSchema = z.object({
  url: landingImageUrlSchema,
  alt: z.string().min(1),
  caption: z.string().optional(),
});

/** Banner hero full-width — ảnh phối cảnh / ngoại cảnh dự án. */
export const projectLandingHeroImageSchema = projectLandingLocationMapSchema;

/** Video giới thiệu dự án — YouTube (kể cả Shorts) hoặc URL phát trực tiếp. */
export const projectLandingIntroVideoSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).optional(),
  caption: z.string().optional(),
});

/** Hồ sơ chủ đầu tư — giảm e ngại khách (MST, niêm yết, trụ sở…), không gắn giá cổ phiếu. */
export const projectLandingDeveloperFactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const projectLandingDeveloperProfileSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  facts: z.array(projectLandingDeveloperFactSchema).default([]),
  note: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  sourceLabel: z.string().optional(),
});

export const projectLandingSchema = z.object({
  version: z.literal(1).default(1),
  heroSubtitle: z.string().optional(),
  /** Ảnh banner phía sau hero (1920×720 khuyến nghị). Fallback: ảnh gallery đầu tiên. */
  heroImage: projectLandingHeroImageSchema.optional(),
  /** Video review / giới thiệu — embed YouTube hoặc file mp4. */
  introVideo: projectLandingIntroVideoSchema.optional(),
  /** Hồ sơ CĐT công khai (niêm yết, MST, lãnh đạo…). */
  developerProfile: projectLandingDeveloperProfileSchema.optional(),
  highlights: z.array(projectLandingBlockSchema).default([]),
  amenities: z.array(z.string().min(1)).default([]),
  /** Ảnh thiết kế: bản đồ khoảng cách tới tiện ích (trái trên desktop). */
  locationMapImage: projectLandingLocationMapSchema.optional(),
  /** Nội dung chi tiết SEO (phải trên desktop, dưới ảnh trên mobile). */
  locationNotes: z.string().optional(),
  faqs: z.array(projectLandingFaqSchema).default([]),
  /** Gói dịch vụ HouseX — hiển thị trên landing NOXH. */
  services: z.array(projectLandingServiceSchema).default([]),
  gallery: z.array(projectLandingGallerySchema).default([]),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  /** Dòng phụ dưới tiêu đề CTA — mời tư vấn, không dùng disclaimer pháp lý. */
  ctaSubtext: z.string().optional(),
});

export type ProjectLanding = z.infer<typeof projectLandingSchema>;
export type ProjectLandingLocationMap = z.infer<
  typeof projectLandingLocationMapSchema
>;
export type ProjectLandingHeroImage = z.infer<
  typeof projectLandingHeroImageSchema
>;
export type ProjectLandingIntroVideo = z.infer<
  typeof projectLandingIntroVideoSchema
>;
export type ProjectLandingDeveloperProfile = z.infer<
  typeof projectLandingDeveloperProfileSchema
>;

export const projectOverviewSchema = z
  .object({
    totalUnits: z.number().int().positive().optional(),
    blocks: z.number().int().positive().optional(),
    landing: projectLandingSchema.optional(),
  })
  .passthrough();

export type ProjectOverview = z.infer<typeof projectOverviewSchema>;

/** Mẫu landing trống — admin clone / tạo mới. */
export function defaultProjectLanding(name: string): ProjectLanding {
  return {
    version: 1,
    heroSubtitle: `Tổng quan ${name} — vị trí, tiện ích và chính sách bán hàng`,
    highlights: [
      {
        title: "Vị trí kết nối thuận lợi",
        text: "Mô tả liên kết giao thông, tiện ích xung quanh (5–7 phút tới…).",
      },
      {
        title: "Pháp lý minh bạch",
        text: "Liệt kê giấy tờ đã có: GPXD, 1/500, thỏa thuận đất…",
      },
      {
        title: "Tiện ích nội khu",
        text: "Hồ bơi, công viên, shophouse, trường học, an ninh 24/7…",
      },
    ],
    amenities: [
      "Hồ bơi",
      "Công viên nội khu",
      "Phòng gym",
      "Shophouse",
      "Bãi đỗ xe",
    ],
    locationNotes: "",
    faqs: [
      {
        q: `${name} có pháp lý đầy đủ chưa?`,
        a: "Cập nhật theo hồ sơ pháp lý thực tế của dự án trên HouseX.",
      },
      {
        q: "Giá bán và tiến độ bàn giao?",
        a: "Xem bảng loại hình sản phẩm và liên hệ tư vấn để nhận bảng giá mới nhất.",
      },
    ],
    services: [],
    gallery: [],
    ctaLabel: "Liên hệ tư vấn",
    ctaHref: "/lien-he",
    ctaSubtext:
      "Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi.",
  };
}

export function parseProjectOverview(raw: unknown): ProjectOverview {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const rawLanding = (raw as { landing?: unknown }).landing;
  const landingParsed = rawLanding
    ? projectLandingSchema.safeParse(rawLanding)
    : null;
  const landing = landingParsed?.success ? landingParsed.data : undefined;

  const parsed = projectOverviewSchema.safeParse(raw);
  if (!parsed.success) {
    const partial = raw as Record<string, unknown>;
    return {
      ...(typeof partial.totalUnits === "number"
        ? { totalUnits: partial.totalUnits }
        : {}),
      ...(typeof partial.blocks === "number" && partial.blocks > 0
        ? { blocks: partial.blocks }
        : {}),
      ...(landing ? { landing } : {}),
    };
  }

  const data = parsed.data;
  if (data.landing) {
    const nested = projectLandingSchema.safeParse(data.landing);
    return { ...data, landing: nested.success ? nested.data : landing };
  }
  return landing ? { ...data, landing } : data;
}

export function parseProjectLanding(raw: unknown): ProjectLanding | null {
  const overview = parseProjectOverview(raw);
  return overview.landing ?? null;
}

/** Ảnh banner hero — ưu tiên heroImage, fallback gallery[0]. */
export function resolveLandingHeroImage(
  landing: ProjectLanding | undefined | null,
  projectName: string,
): ProjectLandingHeroImage | null {
  if (landing?.heroImage?.url) return landing.heroImage;
  const first = landing?.gallery[0];
  if (first?.url) {
    return {
      url: first.url,
      alt: first.caption ?? `Hình ảnh ${projectName}`,
    };
  }
  return null;
}

/** Gộp landing vào overviewData khi lưu admin. */
export function buildOverviewData(
  existing: unknown,
  patch: {
    totalUnits?: number;
    blocks?: number;
    landing?: ProjectLanding;
  },
): ProjectOverview {
  const base = parseProjectOverview(existing);
  return {
    ...base,
    ...(patch.totalUnits != null ? { totalUnits: patch.totalUnits } : {}),
    ...(patch.blocks != null ? { blocks: patch.blocks } : {}),
    ...(patch.landing ? { landing: patch.landing } : {}),
  };
}
