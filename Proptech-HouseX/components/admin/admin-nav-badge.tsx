export function AdminNavBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className="ml-0.5 inline-flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm"
      aria-label={`${count} mục chờ xử lý`}
    >
      {label}
    </span>
  );
}
