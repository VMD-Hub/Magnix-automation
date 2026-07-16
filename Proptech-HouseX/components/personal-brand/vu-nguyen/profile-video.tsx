import { getVuNguyenVideoUrl } from "@/lib/personal-brand/vu-nguyen/profile-content";
import {
  isYoutubeUrl,
  toYoutubeEmbedUrl,
} from "@/lib/media/youtube";
import { cn } from "@/lib/ui/cn";

type Props = {
  variant?: "holder" | "light";
};

export function ProfileVideo({ variant = "light" }: Props) {
  const videoUrl = getVuNguyenVideoUrl();
  const onHolder = variant === "holder";

  if (!videoUrl) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full items-center justify-center rounded-xl border border-dashed px-6 text-center",
          onHolder
            ? "border-white/25 bg-black/15 text-white/75"
            : "border-brand-200 bg-brand-50/50 text-slate-600",
        )}
      >
        <p className="text-sm leading-relaxed">
          Video giới thiệu sắp có — quay postcard 60–90 giây và gắn{" "}
          <code
            className={cn(
              "rounded px-1 text-xs",
              onHolder ? "bg-white/10" : "bg-white",
            )}
          >
            NEXT_PUBLIC_VU_NGUYEN_VIDEO_URL
          </code>
        </p>
      </div>
    );
  }

  const yt = isYoutubeUrl(videoUrl) ? toYoutubeEmbedUrl(videoUrl) : null;

  const frameClass = cn(
    "aspect-video w-full overflow-hidden rounded-xl border shadow-lg",
    onHolder ? "border-white/15" : "border-silver-200",
  );

  if (yt) {
    return (
      <div className={frameClass}>
        <iframe
          title="Video giới thiệu Vũ Nguyễn"
          src={yt}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <video
        className="h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
        src={videoUrl}
      >
        Trình duyệt không hỗ trợ video.
      </video>
    </div>
  );
}
