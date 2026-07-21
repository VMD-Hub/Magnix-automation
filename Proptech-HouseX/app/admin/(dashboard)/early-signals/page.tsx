import { EarlySignalReviewBoard } from "@/components/admin/early-signal-review-board";

export const metadata = {
  title: "Duyệt tin sớm | House X Admin",
};

export default function EarlySignalsAdminPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Duyệt tin sớm (Early Signal)
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Tổng hợp tín hiệu báo/CĐT → xem preview người đọc → Chủ quản duyệt L3
          trước khi đưa tin chính thức. Không auto-nurture khi duyệt. Chi tiết:{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">
            docs/EARLY_SIGNAL_REVIEW.md
          </code>
          .
        </p>
      </div>
      <EarlySignalReviewBoard />
    </div>
  );
}
