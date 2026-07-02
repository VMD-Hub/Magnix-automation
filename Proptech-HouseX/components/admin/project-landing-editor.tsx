"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AdminQuickReferencePanel,
  AdminSectionGuide,
} from "@/components/admin/admin-section-guide";
import {
  PROJECT_LANDING_GUIDES,
  PROJECT_LANDING_IMAGE,
} from "@/lib/content/project-landing-guidelines";
import {
  defaultProjectLanding,
  parseProjectOverview,
  type ProjectLanding,
} from "@/lib/content/project-landing";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_TYPE_LABEL,
} from "@/lib/format";

type Developer = { id: string; name: string; verified: boolean };

type FormState = {
  developerId: string;
  slug: string;
  name: string;
  projectType: "THUONG_MAI" | "NHA_O_XA_HOI";
  status: "SAP_MO_BAN" | "DANG_BAN" | "DA_BAN_GIAO" | "TAM_DUNG";
  province: string;
  district: string;
  ward: string;
  address: string;
  lat: string;
  lng: string;
  totalArea: string;
  density: string;
  description: string;
  handoverDate: string;
  seoTitle: string;
  seoDesc: string;
  totalUnits: string;
  blocks: string;
  landing: ProjectLanding;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";
const labelClass = "block text-sm font-medium text-slate-700";

function emptyForm(name = ""): FormState {
  return {
    developerId: "",
    slug: "",
    name,
    projectType: "THUONG_MAI",
    status: "SAP_MO_BAN",
    province: "",
    district: "",
    ward: "",
    address: "",
    lat: "",
    lng: "",
    totalArea: "",
    density: "",
    description: "",
    handoverDate: "",
    seoTitle: "",
    seoDesc: "",
    totalUnits: "",
    blocks: "",
    landing: defaultProjectLanding(name || "Dự án mới"),
  };
}

function projectToForm(project: Record<string, unknown>): FormState {
  const overview = parseProjectOverview(project.overviewData);
  const p = project as {
    developerId: string;
    slug: string;
    name: string;
    projectType: FormState["projectType"];
    status: FormState["status"];
    province: string;
    district: string;
    ward?: string | null;
    address?: string | null;
    lat?: number | null;
    lng?: number | null;
    totalArea?: number | null;
    density?: number | null;
    description?: string | null;
    handoverDate?: string | null;
    seoTitle?: string | null;
    seoDesc?: string | null;
  };

  return {
    developerId: p.developerId,
    slug: p.slug,
    name: p.name,
    projectType: p.projectType,
    status: p.status,
    province: p.province,
    district: p.district,
    ward: p.ward ?? "",
    address: p.address ?? "",
    lat: p.lat != null ? String(p.lat) : "",
    lng: p.lng != null ? String(p.lng) : "",
    totalArea: p.totalArea != null ? String(p.totalArea) : "",
    density: p.density != null ? String(p.density) : "",
    description: p.description ?? "",
    handoverDate: p.handoverDate
      ? new Date(p.handoverDate).toISOString().slice(0, 10)
      : "",
    seoTitle: p.seoTitle ?? "",
    seoDesc: p.seoDesc ?? "",
    totalUnits:
      overview.totalUnits != null ? String(overview.totalUnits) : "",
    blocks: overview.blocks != null ? String(overview.blocks) : "",
    landing: overview.landing ?? defaultProjectLanding(p.name),
  };
}

function formToPayload(form: FormState) {
  return {
    developerId: form.developerId,
    slug: form.slug.trim(),
    name: form.name.trim(),
    projectType: form.projectType,
    status: form.status,
    province: form.province.trim(),
    district: form.district.trim(),
    ward: form.ward.trim() || undefined,
    address: form.address.trim() || undefined,
    lat: form.lat ? Number(form.lat) : null,
    lng: form.lng ? Number(form.lng) : null,
    totalArea: form.totalArea ? Number(form.totalArea) : null,
    density: form.density ? Number(form.density) : null,
    description: form.description.trim() || undefined,
    handoverDate: form.handoverDate || null,
    seoTitle: form.seoTitle.trim() || undefined,
    seoDesc: form.seoDesc.trim() || undefined,
    totalUnits: form.totalUnits ? Number(form.totalUnits) : null,
    blocks: form.blocks ? Number(form.blocks) : null,
    landing: {
      ...form.landing,
      version: 1 as const,
      highlights: form.landing.highlights.filter(
        (h) => h.title.trim() && h.text.trim(),
      ),
      amenities: form.landing.amenities.filter((a) => a.trim()),
      faqs: form.landing.faqs.filter((f) => f.q.trim() && f.a.trim()),
      gallery: form.landing.gallery.filter((g) => g.url.trim()),
      locationMapImage: form.landing.locationMapImage?.url?.trim()
        ? {
            url: form.landing.locationMapImage.url.trim(),
            alt:
              form.landing.locationMapImage.alt?.trim() ||
              `Bản đồ vị trí ${form.name.trim()}`,
            caption:
              form.landing.locationMapImage.caption?.trim() || undefined,
          }
        : undefined,
      heroImage: form.landing.heroImage?.url?.trim()
        ? {
            url: form.landing.heroImage.url.trim(),
            alt:
              form.landing.heroImage.alt?.trim() ||
              `Banner ${form.name.trim()}`,
            caption: form.landing.heroImage.caption?.trim() || undefined,
          }
        : undefined,
    },
  };
}

export function ProjectLandingEditor({
  projectId,
}: {
  projectId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(projectId);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const devRes = await fetch("/api/admin/developers");
        if (devRes.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        const devJson = await devRes.json();
        if (devRes.ok) {
          setDevelopers(devJson.data.items);
        }

        if (projectId) {
          const res = await fetch(`/api/admin/projects/${projectId}`);
          const json = await res.json();
          if (!res.ok) {
            setError(json.error?.message ?? "Không tải được dự án.");
            return;
          }
          setForm(projectToForm(json.data.project));
        } else if (devJson.data?.items?.[0]) {
          setForm((f) => ({
            ...emptyForm(),
            developerId: devJson.data.items[0].id,
          }));
        }
      } catch {
        setError("Lỗi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [projectId]);

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "name" && !isEdit && !prev.slug) {
          next.landing = defaultProjectLanding(String(value));
        }
        return next;
      });
    },
    [isEdit],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = formToPayload(form);
      const url = isEdit
        ? `/api/admin/projects/${projectId}`
        : "/api/admin/projects";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const details = json.error?.details;
        setError(
          json.error?.message +
            (Array.isArray(details) ? ` (${details.length} lỗi)` : ""),
        );
        return;
      }
      setMessage("Đã lưu dự án.");
      if (!isEdit) {
        router.push(`/admin/projects/${json.data.project.id}`);
      } else {
        setForm(projectToForm(json.data.project));
      }
    } catch {
      setError("Lỗi mạng khi lưu.");
    } finally {
      setSaving(false);
    }
  }

  function slugifyName() {
    const slug = form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setField("slug", slug);
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải form…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/projects"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Danh sách dự án
        </Link>
        {isEdit && form.slug && (
          <a
            href={`/du-an/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-700 hover:underline"
          >
            Xem landing công khai
          </a>
        )}
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      <AdminQuickReferencePanel />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Thông tin cơ bản
        </h2>
        <AdminSectionGuide
          guide={PROJECT_LANDING_GUIDES.basic}
          className="mt-4"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Chủ đầu tư *
            <select
              required
              value={form.developerId}
              onChange={(e) => setField("developerId", e.target.value)}
              className={inputClass}
            >
              <option value="">— Chọn —</option>
              {developers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                  {d.verified ? " ✓" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Tên dự án *
            <input
              required
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Slug URL *
            <div className="mt-1 flex gap-2">
              <input
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                className={inputClass}
                placeholder="housex-riverside"
              />
              {!isEdit && (
                <Button type="button" variant="outline" size="sm" onClick={slugifyName}>
                  Tạo slug
                </Button>
              )}
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>
              Loại hình
              <select
                value={form.projectType}
                onChange={(e) =>
                  setField(
                    "projectType",
                    e.target.value as FormState["projectType"],
                  )
                }
                className={inputClass}
              >
                {Object.entries(PROJECT_TYPE_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Trạng thái
              <select
                value={form.status}
                onChange={(e) =>
                  setField("status", e.target.value as FormState["status"])
                }
                className={inputClass}
              >
                {Object.entries(PROJECT_STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className={labelClass}>
            Tỉnh / TP *
            <input
              required
              value={form.province}
              onChange={(e) => setField("province", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Quận / Huyện *
            <input
              required
              value={form.district}
              onChange={(e) => setField("district", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Phường / Xã
            <input
              value={form.ward}
              onChange={(e) => setField("ward", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Địa chỉ
            <input
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              className={inputClass}
              placeholder="Số nhà, tên đường"
            />
          </label>
          <label className={labelClass}>
            Vĩ độ (lat)
            <input
              type="number"
              step="any"
              min={-90}
              max={90}
              value={form.lat}
              onChange={(e) => setField("lat", e.target.value)}
              className={inputClass}
              placeholder="10.7295 — tuỳ chọn, chỉ JSON-LD SEO"
            />
          </label>
          <label className={labelClass}>
            Kinh độ (lng)
            <input
              type="number"
              step="any"
              min={-180}
              max={180}
              value={form.lng}
              onChange={(e) => setField("lng", e.target.value)}
              className={inputClass}
              placeholder="106.7218 — không hiển thị trên trang"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">SEO & mô tả</h2>
        <AdminSectionGuide guide={PROJECT_LANDING_GUIDES.seo} className="mt-4" />
        <div className="mt-4 grid gap-4">
          <label className={labelClass}>
            SEO title
            <input
              value={form.seoTitle}
              onChange={(e) => setField("seoTitle", e.target.value)}
              className={inputClass}
              maxLength={70}
              placeholder="50–60 ký tự, có tên dự án + quận"
            />
          </label>
          <label className={labelClass}>
            SEO description
            <textarea
              rows={2}
              value={form.seoDesc}
              onChange={(e) => setField("seoDesc", e.target.value)}
              className={inputClass}
              maxLength={160}
              placeholder="140–160 ký tự"
            />
          </label>
          <label className={labelClass}>
            Mô tả tổng quan (body landing)
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={inputClass}
              placeholder="300–800 ký tự, xuống dòng theo đoạn"
            />
          </label>
          <label className={labelClass}>
            Hero subtitle
            <input
              value={form.landing.heroSubtitle ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, heroSubtitle: e.target.value },
                }))
              }
              className={inputClass}
              maxLength={160}
              placeholder="≤ 160 ký tự — 1 câu USP dưới H1"
            />
          </label>
          <label className={labelClass}>
            Hero banner — URL ảnh (1920×720)
            <input
              value={form.landing.heroImage?.url ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    heroImage: {
                      url: e.target.value,
                      alt: prev.landing.heroImage?.alt ?? "",
                      caption: prev.landing.heroImage?.caption ?? "",
                    },
                  },
                }))
              }
              className={inputClass}
              placeholder="https://cdn…/banner-dta-happy-home.jpg"
            />
          </label>
          <label className={labelClass}>
            Hero banner — alt text
            <input
              value={form.landing.heroImage?.alt ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: {
                    ...prev.landing,
                    heroImage: {
                      url: prev.landing.heroImage?.url ?? "",
                      alt: e.target.value,
                      caption: prev.landing.heroImage?.caption ?? "",
                    },
                  },
                }))
              }
              className={inputClass}
              placeholder="Phối cảnh DTA Happy Home Nhơn Trạch"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Thông số</h2>
        <AdminSectionGuide guide={PROJECT_LANDING_GUIDES.stats} className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={labelClass}>
            Số căn
            <input
              type="number"
              min={1}
              value={form.totalUnits}
              onChange={(e) => setField("totalUnits", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Số block
            <input
              type="number"
              min={1}
              value={form.blocks}
              onChange={(e) => setField("blocks", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Diện tích (ha)
            <input
              type="number"
              step="0.1"
              value={form.totalArea}
              onChange={(e) => setField("totalArea", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Mật độ (%)
            <input
              type="number"
              value={form.density}
              onChange={(e) => setField("density", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Bàn giao
            <input
              type="date"
              value={form.handoverDate}
              onChange={(e) => setField("handoverDate", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <LandingHighlightsEditor
        highlights={form.landing.highlights}
        onChange={(highlights) =>
          setForm((prev) => ({
            ...prev,
            landing: { ...prev.landing, highlights },
          }))
        }
      />

      <LandingAmenitiesEditor
        amenities={form.landing.amenities}
        onChange={(amenities) =>
          setForm((prev) => ({
            ...prev,
            landing: { ...prev.landing, amenities },
          }))
        }
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Vị trí &amp; kết nối (ảnh + text)
        </h2>
        <AdminSectionGuide
          guide={PROJECT_LANDING_GUIDES.location}
          className="mt-4"
        />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ảnh bản đồ minh hoạ (trái trên desktop)
            </p>
            <label className={labelClass}>
              URL ảnh *
              <input
                value={form.landing.locationMapImage?.url ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing: {
                      ...prev.landing,
                      locationMapImage: {
                        url: e.target.value,
                        alt: prev.landing.locationMapImage?.alt ?? "",
                        caption: prev.landing.locationMapImage?.caption ?? "",
                      },
                    },
                  }))
                }
                className={inputClass}
                placeholder="https://… — 1200×900 px, tỷ lệ 4:3"
              />
            </label>
            <label className={labelClass}>
              Alt text (SEO) *
              <input
                value={form.landing.locationMapImage?.alt ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing: {
                      ...prev.landing,
                      locationMapImage: {
                        url: prev.landing.locationMapImage?.url ?? "",
                        alt: e.target.value,
                        caption: prev.landing.locationMapImage?.caption ?? "",
                      },
                    },
                  }))
                }
                className={inputClass}
                maxLength={120}
                placeholder="Bản đồ khoảng cách [tên dự án] tới…"
              />
            </label>
            <label className={labelClass}>
              Chú thích ảnh (tuỳ chọn)
              <input
                value={form.landing.locationMapImage?.caption ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    landing: {
                      ...prev.landing,
                      locationMapImage: {
                        url: prev.landing.locationMapImage?.url ?? "",
                        alt: prev.landing.locationMapImage?.alt ?? "",
                        caption: e.target.value,
                      },
                    },
                  }))
                }
                className={inputClass}
                maxLength={80}
                placeholder="Bán kính 5 km — thời gian di chuyển xe"
              />
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nội dung chi tiết (phải trên desktop)
            </p>
            <textarea
              rows={12}
              value={form.landing.locationNotes ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, locationNotes: e.target.value },
                }))
              }
              className={inputClass}
              placeholder={
                "200–800 ký tự. Xuống dòng giữa các đoạn.\n\nVí dụ:\n• 5 phút tới Crescent Mall, Phú Mỹ Hưng\n• 10 phút tới bệnh viện FV\n• 20 phút tới trung tâm Quận 1 qua Nguyễn Hữu Thọ"
              }
            />
          </div>
        </div>
      </section>

      <LandingFaqsEditor
        faqs={form.landing.faqs}
        onChange={(faqs) =>
          setForm((prev) => ({
            ...prev,
            landing: { ...prev.landing, faqs },
          }))
        }
      />

      <LandingGalleryEditor
        gallery={form.landing.gallery}
        onChange={(gallery) =>
          setForm((prev) => ({
            ...prev,
            landing: { ...prev.landing, gallery },
          }))
        }
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">CTA cuối trang</h2>
        <AdminSectionGuide guide={PROJECT_LANDING_GUIDES.cta} className="mt-4" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>
            Dòng mời tư vấn (hiển thị trên nút)
            <input
              value={form.landing.ctaSubtext ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, ctaSubtext: e.target.value },
                }))
              }
              className={inputClass}
              maxLength={120}
              placeholder="Tư vấn chi tiết hơn về dự án — liên hệ với chúng tôi."
            />
          </label>
          <label className={labelClass}>
            Nút CTA
            <input
              value={form.landing.ctaLabel ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, ctaLabel: e.target.value },
                }))
              }
              className={inputClass}
              maxLength={40}
              placeholder="Liên hệ tư vấn"
            />
          </label>
          <label className={labelClass}>
            Link CTA
            <input
              value={form.landing.ctaHref ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, ctaHref: e.target.value },
                }))
              }
              className={inputClass}
              placeholder="/lien-he"
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3 pb-8">
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu…" : isEdit ? "Cập nhật landing" : "Tạo dự án"}
        </Button>
      </div>
    </form>
  );
}

function LandingHighlightsEditor({
  highlights,
  onChange,
}: {
  highlights: ProjectLanding["highlights"];
  onChange: (v: ProjectLanding["highlights"]) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Điểm nổi bật (H3)
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([
              ...highlights,
              { title: "Tiêu đề mới", text: "Mô tả ngắn…" },
            ])
          }
        >
          + Thêm
        </Button>
      </div>
      <AdminSectionGuide
        guide={PROJECT_LANDING_GUIDES.highlights}
        className="mt-4"
      />
      <div className="mt-4 space-y-4">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <input
              value={h.title}
              onChange={(e) => {
                const next = [...highlights];
                next[i] = { ...next[i], title: e.target.value };
                onChange(next);
              }}
              className={inputClass}
              placeholder="Tiêu đề H3 — ≤ 60 ký tự"
              maxLength={60}
            />
            <textarea
              rows={2}
              value={h.text}
              onChange={(e) => {
                const next = [...highlights];
                next[i] = { ...next[i], text: e.target.value };
                onChange(next);
              }}
              className={`${inputClass} mt-2`}
              placeholder="80–250 ký tự, 2–4 câu có số liệu"
              maxLength={250}
            />
            <button
              type="button"
              onClick={() => onChange(highlights.filter((_, j) => j !== i))}
              className="mt-2 text-xs text-rose-600 hover:underline"
            >
              Xoá
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function LandingAmenitiesEditor({
  amenities,
  onChange,
}: {
  amenities: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Tiện ích</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...amenities, ""])}
        >
          + Thêm
        </Button>
      </div>
      <AdminSectionGuide
        guide={PROJECT_LANDING_GUIDES.amenities}
        className="mt-4"
      />
      <div className="mt-4 space-y-2">
        {amenities.map((a, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={a}
              onChange={(e) => {
                const next = [...amenities];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={inputClass}
              placeholder="≤ 30 ký tự / tag"
              maxLength={30}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(amenities.filter((_, j) => j !== i))}
            >
              Xoá
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function LandingFaqsEditor({
  faqs,
  onChange,
}: {
  faqs: ProjectLanding["faqs"];
  onChange: (v: ProjectLanding["faqs"]) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          FAQ (Q&A SEO + JSON-LD)
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([...faqs, { q: "Câu hỏi mới?", a: "Trả lời…" }])
          }
        >
          + Thêm
        </Button>
      </div>
      <AdminSectionGuide guide={PROJECT_LANDING_GUIDES.faqs} className="mt-4" />
      <div className="mt-4 space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <input
              value={f.q}
              onChange={(e) => {
                const next = [...faqs];
                next[i] = { ...next[i], q: e.target.value };
                onChange(next);
              }}
              className={inputClass}
              placeholder="Câu hỏi (H3) — kết thúc bằng ?"
              maxLength={120}
            />
            <textarea
              rows={2}
              value={f.a}
              onChange={(e) => {
                const next = [...faqs];
                next[i] = { ...next[i], a: e.target.value };
                onChange(next);
              }}
              className={`${inputClass} mt-2`}
              placeholder="80–400 ký tự"
              maxLength={400}
            />
            <button
              type="button"
              onClick={() => onChange(faqs.filter((_, j) => j !== i))}
              className="mt-2 text-xs text-rose-600 hover:underline"
            >
              Xoá
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function LandingGalleryEditor({
  gallery,
  onChange,
}: {
  gallery: ProjectLanding["gallery"];
  onChange: (v: ProjectLanding["gallery"]) => void;
}) {
  const { galleryWidth, galleryHeight } = PROJECT_LANDING_IMAGE;
  const placeholderUrl = `https://placehold.co/${galleryWidth}x${galleryHeight}`;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Gallery ảnh</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([...gallery, { url: placeholderUrl, caption: "" }])
          }
        >
          + Thêm
        </Button>
      </div>
      <AdminSectionGuide
        guide={PROJECT_LANDING_GUIDES.gallery}
        className="mt-4"
      />
      <div className="mt-4 space-y-4">
        {gallery.map((g, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <input
              value={g.url}
              onChange={(e) => {
                const next = [...gallery];
                next[i] = { ...next[i], url: e.target.value };
                onChange(next);
              }}
              className={inputClass}
              placeholder={`URL ảnh HTTPS — ${galleryWidth}×${galleryHeight} px, 16:9`}
            />
            <input
              value={g.caption ?? ""}
              onChange={(e) => {
                const next = [...gallery];
                next[i] = { ...next[i], caption: e.target.value };
                onChange(next);
              }}
              className={`${inputClass} mt-2`}
              placeholder="Chú thích ảnh (alt text) — ≤ 80 ký tự"
              maxLength={80}
            />
            <button
              type="button"
              onClick={() => onChange(gallery.filter((_, j) => j !== i))}
              className="mt-2 text-xs text-rose-600 hover:underline"
            >
              Xoá
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
