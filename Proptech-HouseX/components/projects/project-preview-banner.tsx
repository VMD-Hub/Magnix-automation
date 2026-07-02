type Props = {
  productionPath?: string;
};

/** Thanh vàng trên trang preview — không index SEO. */
export function ProjectPreviewBanner({ productionPath }: Props) {
  return (
    <div
      role="status"
      className="border-b border-amber-300/80 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
    >
      <span className="font-semibold">Bản xem trước giao diện</span>
      <span className="mx-2 hidden text-amber-400 sm:inline">·</span>
      <span className="mt-1 block sm:mt-0 sm:inline">
        Mock data — không cần Postgres. Duyệt layout trước go-live.
      </span>
      {productionPath && (
        <span className="mt-1 block text-xs text-amber-800/90 sm:mt-0 sm:ml-2 sm:inline">
          URL production:{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono">
            {productionPath}
          </code>
        </span>
      )}
    </div>
  );
}
