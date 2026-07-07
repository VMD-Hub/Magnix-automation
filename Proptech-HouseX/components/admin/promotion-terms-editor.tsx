"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PromotionTermsSection } from "@/components/promotion/promotion-terms-section";
import { cn } from "@/lib/ui/cn";

export function PromotionTermsEditor({
  campaignId,
  initialMarkdown,
  onSaved,
}: {
  campaignId: string;
  initialMarkdown: string;
  onSaved?: (markdown: string) => void;
}) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const dirty = markdown !== initialMarkdown;

  useEffect(() => {
    setMarkdown(initialMarkdown);
  }, [initialMarkdown]);

  async function saveTerms() {
    setSaving(true);
    setMsg(null);
    setError(null);
    const res = await fetch(`/api/admin/promotions/${campaignId}/terms`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ termsMarkdown: markdown }),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("Đã lưu thể lệ — hiển thị ngay trên trang Khuyến mãi.");
      onSaved?.(markdown);
    } else {
      setError(json.error?.message ?? "Không lưu được thể lệ.");
    }
  }

  async function resetToTemplate() {
    if (
      !window.confirm(
        "Khôi phục thể lệ mẫu từ dữ liệu campaign hiện tại? Nội dung đang soạn (chưa lưu) sẽ bị thay thế.",
      )
    ) {
      return;
    }
    setResetting(true);
    setMsg(null);
    setError(null);
    const res = await fetch(`/api/admin/promotions/${campaignId}/terms`, {
      method: "POST",
    });
    const json = await res.json();
    setResetting(false);
    if (res.ok && json.data?.termsMarkdown) {
      setMarkdown(json.data.termsMarkdown as string);
      setMsg("Đã tạo lại thể lệ mẫu — nhấn Lưu thể lệ để công bố.");
      setTab("edit");
    } else {
      setError(json.error?.message ?? "Không khôi phục được mẫu.");
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Thể lệ chương trình</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Soạn bằng Markdown (# tiêu đề, **in đậm**, bảng | cột |). Team pháp lý chỉnh
            trực tiếp — không cần chạy seed.
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              tab === "edit"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            Soạn thảo
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded-md px-3 py-1.5 font-medium transition-colors",
              tab === "preview"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            Xem trước
          </button>
        </div>
      </div>

      {tab === "edit" ? (
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          aria-label="Thể lệ chương trình (Markdown)"
        />
      ) : (
        <div className="max-h-[32rem] overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/50 p-2">
          <PromotionTermsSection markdown={markdown} id="admin-terms-preview" />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          disabled={saving || !dirty}
          onClick={() => void saveTerms()}
        >
          {saving ? "Đang lưu…" : "Lưu thể lệ"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={resetting}
          onClick={() => void resetToTemplate()}
        >
          {resetting ? "Đang tạo mẫu…" : "Khôi phục mẫu mặc định"}
        </Button>
        {dirty ? (
          <span className="text-xs text-amber-700">Có thay đổi chưa lưu</span>
        ) : null}
      </div>

      {msg ? <p className="mt-2 text-sm text-emerald-700">{msg}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <p className="mt-3 text-xs text-slate-500">
        Gợi ý bảng giải:{" "}
        <code className="rounded bg-slate-100 px-1">
          | STT | Hạng giải | Chi tiết | Số lượng | Quy đổi tiền mặt | Hiệu lực |
        </code>
      </p>
    </section>
  );
}
