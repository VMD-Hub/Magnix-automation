import type { ProjectLandingIntroVideo } from "@/lib/content/project-landing";
import {
  isYoutubeShortsUrl,
  isYoutubeUrl,
  toYoutubeEmbedUrl,
  toYoutubeWatchUrl,
} from "@/lib/media/youtube";
import { cn } from "@/lib/ui/cn";

type Props = {
  video: ProjectLandingIntroVideo;
  projectName: string;
};

export function ProjectIntroVideo({ video, projectName }: Props) {
  const title =
    video.title?.trim() || `Video giới thiệu ${projectName}`;
  const caption = video.caption?.trim();
  const ytEmbed = isYoutubeUrl(video.url)
    ? toYoutubeEmbedUrl(video.url)
    : null;
  const watchUrl = ytEmbed ? toYoutubeWatchUrl(video.url) : video.url;
  const shorts = ytEmbed ? isYoutubeShortsUrl(video.url) : false;

  return (
    <section id="project-intro-video" aria-labelledby="project-intro-video-heading">
      <h2
        id="project-intro-video-heading"
        className="lux-heading-accent text-2xl font-bold"
      >
        {title}
      </h2>
      {caption && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          {caption}
        </p>
      )}

      <div
        className={cn(
          "mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-ink-900 shadow-sm",
          shorts ? "mx-auto max-w-[360px]" : "w-full",
        )}
      >
        {ytEmbed ? (
          <div className={shorts ? "aspect-[9/16]" : "aspect-video"}>
            <iframe
              title={title}
              src={ytEmbed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="aspect-video">
            <video
              className="h-full w-full object-contain"
              controls
              playsInline
              preload="metadata"
              src={video.url}
            >
              Trình duyệt không hỗ trợ video.
            </video>
          </div>
        )}
      </div>

      {watchUrl && (
        <p className="mt-3 text-sm text-slate-500">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Xem trên YouTube
          </a>
        </p>
      )}
    </section>
  );
}
