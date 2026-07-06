import { ToolsHubSkeleton } from "@/components/ui/catalog-page-skeleton";

export default function CongCuLoading() {
  return (
    <div
      className="proptech-section-glow mx-auto max-w-7xl py-8 container-px"
      aria-busy="true"
      aria-label="Đang tải công cụ"
    >
      <ToolsHubSkeleton />
    </div>
  );
}
