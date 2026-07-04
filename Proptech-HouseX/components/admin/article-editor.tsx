"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";

type TagOption = { id: string; slug: string; name: string };
type ProjectOption = {
  id: string;
  slug: string;
  name: string;
  projectType: string;
};

type ArticleForm = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverImageUrl: string;
  authorName: string;
  seoTitle: string;
  seoDesc: string;
  tagSlugs: string[];
  projectIds: string[];
};

const emptyForm = (): ArticleForm => ({
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  status: "DRAFT",
  coverImageUrl: "",
  authorName: "Ban biên tập House X",
  seoTitle: "",
  seoDesc: "",
  tagSlugs: [],
  projectIds: [],
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export function ArticleEditor({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleForm>(emptyForm());
  const [tags, setTags] = useState<TagOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadMeta = useCallback(async () => {
    const res = await fetch("/api/admin/article-tags");
    const json = await res.json();
    if (res.ok) {
      setTags(json.data.tags);
      setProjects(json.data.projects);
    }
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    if (!articleId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/articles/${articleId}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error?.message ?? "Không tải được bài viết.");
          return;
        }
        const a = json.data.article;
        setForm({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt ?? "",
          body: a.body,
          status: a.status,
          coverImageUrl: a.coverImageUrl ?? "",
          authorName: a.authorName ?? "",
          seoTitle: a.seoTitle ?? "",
          seoDesc: a.seoDesc ?? "",
          tagSlugs: a.tags.map((t: { tag: TagOption }) => t.tag.slug),
          projectIds: a.projects.map(
            (p: { project: ProjectOption }) => p.project.id,
          ),
        });
      } catch {
        setError("Lỗi mạng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  function setField<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleTag(slug: string) {
    setForm((prev) => ({
      ...prev,
      tagSlugs: prev.tagSlugs.includes(slug)
        ? prev.tagSlugs.filter((s) => s !== slug)
        : [...prev.tagSlugs, slug],
    }));
  }

  function toggleProject(id: string) {
    setForm((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(id)
        ? prev.projectIds.filter((x) => x !== id)
        : [...prev.projectIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        ...form,
        excerpt: form.excerpt || null,
        coverImageUrl: form.coverImageUrl || null,
        authorName: form.authorName || null,
        seoTitle: form.seoTitle || null,
        seoDesc: form.seoDesc || null,
        publishedAt:
          form.status === "PUBLISHED" ? new Date().toISOString() : null,
      };
      const url = articleId
        ? `/api/admin/articles/${articleId}`
        : "/api/admin/articles";
      const res = await fetch(url, {
        method: articleId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Lưu thất bại.");
        return;
      }
      setMessage("Đã lưu bài viết.");
      if (!articleId) {
        router.push(`/admin/articles/${json.data.article.id}`);
      }
      router.refresh();
    } catch {
      setError("Lỗi mạng.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-600">Đang tải…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </p>
      )}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Tiêu đề *</span>
          <input
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((prev) => ({
                ...prev,
                title,
                slug: prev.slug || slugify(title),
                seoTitle: prev.seoTitle || title.slice(0, 200),
              }));
            }}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Slug URL *</span>
          <input
            required
            value={form.slug}
            onChange={(e) => setField("slug", slugify(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Trạng thái</span>
          <select
            value={form.status}
            onChange={(e) =>
              setField("status", e.target.value as ArticleForm["status"])
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          >
            <option value="DRAFT">Nháp</option>
            <option value="PUBLISHED">Xuất bản</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </label>
        <label className="block lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Tóm tắt</span>
          <textarea
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Nội dung *</span>
          <p className="text-xs text-slate-500">Phân đoạn bằng dòng trống.</p>
          <textarea
            required
            value={form.body}
            onChange={(e) => setField("body", e.target.value)}
            rows={14}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Chủ đề (tag)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.slug)}
              className={`rounded-full px-3 py-1 text-sm ${
                form.tagSlugs.includes(t.slug)
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Gắn dự án</h2>
        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
          {projects.map((p) => (
            <label key={p.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.projectIds.includes(p.id)}
                onChange={() => toggleProject(p.id)}
              />
              <span className="text-sm text-slate-800">{p.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Ảnh cover URL</span>
          <input
            value={form.coverImageUrl}
            onChange={(e) => setField("coverImageUrl", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tác giả</span>
          <input
            value={form.authorName}
            onChange={(e) => setField("authorName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">SEO Title</span>
          <input
            value={form.seoTitle}
            onChange={(e) => setField("seoTitle", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">SEO Description</span>
          <textarea
            value={form.seoDesc}
            onChange={(e) => setField("seoDesc", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu…" : "Lưu bài viết"}
        </Button>
        <ButtonLink href="/admin/articles" variant="outline">
          Quay lại
        </ButtonLink>
        {form.status === "PUBLISHED" && form.slug && (
          <ButtonLink
            href={`/tin-tuc/${form.slug}`}
            target="_blank"
            variant="outline"
          >
            Xem trên site
          </ButtonLink>
        )}
      </div>
    </form>
  );
}
