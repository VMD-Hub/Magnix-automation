type Props = {
  message?: string;
};

/** Thanh thông báo khi danh sách / chi tiết dùng dữ liệu demo (chưa seed DB). */
export function DemoCatalogBanner({ message }: Props) {
  return (
    <div
      role="status"
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
    >
      <span className="font-semibold">Dữ liệu demo</span>
      <span className="mx-2 hidden text-amber-400 sm:inline">·</span>
      <span className="mt-1 block sm:mt-0 sm:inline">
        {message ??
          "Postgres chưa seed — đang hiển thị dự án mẫu. Chạy npm run db:setup để dùng DB thật."}
      </span>
    </div>
  );
}
