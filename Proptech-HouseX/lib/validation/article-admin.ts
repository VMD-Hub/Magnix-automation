import { z } from "zod";

export const articleAdminSaveSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: chữ thường, số, gạch ngang"),
  title: z.string().min(3).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  body: z.string().min(20),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().datetime().optional().nullable(),
  coverImageUrl: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),
  authorName: z.string().max(100).optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDesc: z.string().max(320).optional().nullable(),
  tagSlugs: z.array(z.string()).default([]),
  projectIds: z.array(z.string().uuid()).default([]),
});

export type ArticleAdminSaveInput = z.infer<typeof articleAdminSaveSchema>;

export const articleTagAdminSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
});
