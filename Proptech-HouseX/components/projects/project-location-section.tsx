import type { ProjectLandingLocationMap } from "@/lib/content/project-landing";
import { FallbackImage } from "@/components/ui/fallback-image";

type Props = {
  projectName: string;
  mapImage?: ProjectLandingLocationMap | null;
  locationNotes?: string | null;
  /** Địa chỉ canonical (địa giới mới) */
  addressPrimary?: string | null;
  /** Dòng alias cũ — “Trước đây / quen gọi: …” */
  addressLegacyLine?: string | null;
};

/**
 * Block vị trí: ảnh bản đồ minh hoạ (trái) + nội dung text SEO (phải).
 * Mobile: ảnh trên, text dưới — không embed Google Maps.
 */
export function ProjectLocationSection({
  projectName,
  mapImage,
  locationNotes,
  addressPrimary,
  addressLegacyLine,
}: Props) {
  const hasMap = Boolean(mapImage?.url);
  const hasText = Boolean(locationNotes?.trim());
  const hasAddress = Boolean(addressPrimary?.trim());
  if (!hasMap && !hasText && !hasAddress) return null;

  return (
    <section aria-labelledby="project-location-heading">
      <h2
        id="project-location-heading"
        className="text-2xl font-semibold text-slate-900"
      >
        Vị trí {projectName} thuận lợi ra sao?
      </h2>

      {hasAddress && (
        <div className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
          <p className="font-medium text-slate-900">{addressPrimary}</p>
          {addressLegacyLine && (
            <p className="mt-1 text-sm text-slate-500">{addressLegacyLine}</p>
          )}
        </div>
      )}

      <div
        className={
          hasMap && hasText
            ? "mt-6 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10"
            : "mt-6"
        }
      >
        {hasMap && mapImage && (
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
            <FallbackImage
              src={mapImage.url}
              alt={mapImage.alt}
              className="aspect-[4/3] w-full bg-slate-50 object-contain"
              loading="lazy"
              decoding="async"
            />
            {mapImage.caption && (
              <figcaption className="border-t border-slate-100 px-4 py-3 text-center text-sm text-slate-600">
                {mapImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {hasText && (
          <div
            className={
              hasMap
                ? "flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                : "max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            }
          >
            <div className="space-y-4 text-base leading-relaxed text-slate-700">
              {locationNotes!.split(/\n{2,}/).map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
