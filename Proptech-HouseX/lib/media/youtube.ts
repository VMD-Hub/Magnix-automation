/** YouTube watch / Shorts / youtu.be → embed URL + metadata. */

const YOUTUBE_HOST =
  /^(?:www\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)$/i;

export function isYoutubeUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return YOUTUBE_HOST.test(host);
  } catch {
    return false;
  }
}

/** Extract 11-char video id from common YouTube URL shapes. */
export function extractYoutubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return isValidYoutubeId(id) ? id : null;
    }

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = u.searchParams.get("v");
      if (isValidYoutubeId(v)) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      // /shorts/ID · /embed/ID · /live/ID · /v/ID
      if (
        parts.length >= 2 &&
        ["shorts", "embed", "live", "v"].includes(parts[0])
      ) {
        const id = parts[1];
        return isValidYoutubeId(id) ? id : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isValidYoutubeId(id: string | null | undefined): id is string {
  return Boolean(id && /^[\w-]{11}$/.test(id));
}

export function isYoutubeShortsUrl(url: string): boolean {
  try {
    return /\/shorts\//i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

export function toYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function toYoutubeWatchUrl(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}
