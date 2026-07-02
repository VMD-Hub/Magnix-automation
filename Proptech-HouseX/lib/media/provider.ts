/**
 * Abstraction cho dịch vụ video được quản lý (managed video) — quyết định ADR-005.
 * Web-VPS KHÔNG host/transcode video; chỉ tạo direct upload và nhận metadata qua
 * webhook. Watermark/thumbnail do nhà cung cấp lo (cấu hình ở library/profile).
 */

export interface VideoUpload {
  assetId: string; // id asset bên provider (lưu vào ListingMedia.playbackId)
  uploadUrl: string; // client PUT/POST trực tiếp file lên đây
  playbackUrl?: string; // có thể biết trước (HLS) hoặc lấy sau qua webhook
}

export interface MediaProvider {
  readonly name: string;
  createVideoUpload(opts: { listingId: string; title?: string }): Promise<VideoUpload>;
  /** URL phát (HLS) từ assetId — dùng khi webhook báo READY. */
  playbackUrl(assetId: string): string;
}

class StubProvider implements MediaProvider {
  readonly name = "stub";
  async createVideoUpload(opts: { listingId: string; title?: string }) {
    const assetId = `stub_${opts.listingId.slice(0, 8)}_${Date.now().toString(36)}`;
    return {
      assetId,
      uploadUrl: `https://upload.example/stub/${assetId}`,
      playbackUrl: this.playbackUrl(assetId),
    };
  }
  playbackUrl(assetId: string) {
    return `https://cdn.example/stub/${assetId}/playlist.m3u8`;
  }
}

class BunnyStreamProvider implements MediaProvider {
  readonly name = "bunny";
  constructor(
    private libraryId: string,
    private apiKey: string,
    private cdnHost: string,
  ) {}

  async createVideoUpload(opts: { listingId: string; title?: string }) {
    const res = await fetch(
      `https://video.bunnycdn.com/library/${this.libraryId}/videos`,
      {
        method: "POST",
        headers: { AccessKey: this.apiKey, "content-type": "application/json" },
        body: JSON.stringify({ title: opts.title ?? opts.listingId }),
      },
    );
    if (!res.ok) throw new Error(`Bunny create video failed: ${res.status}`);
    const data = (await res.json()) as { guid: string };
    return {
      assetId: data.guid,
      uploadUrl: `https://video.bunnycdn.com/library/${this.libraryId}/videos/${data.guid}`,
      playbackUrl: this.playbackUrl(data.guid),
    };
  }

  playbackUrl(assetId: string) {
    return `https://${this.cdnHost}/${assetId}/playlist.m3u8`;
  }
}

class CloudflareStreamProvider implements MediaProvider {
  readonly name = "cloudflare_stream";
  constructor(
    private accountId: string,
    private token: string,
  ) {}

  async createVideoUpload(opts: { listingId: string; title?: string }) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600,
          meta: { listingId: opts.listingId },
        }),
      },
    );
    if (!res.ok) throw new Error(`Cloudflare direct_upload failed: ${res.status}`);
    const data = (await res.json()) as {
      result: { uid: string; uploadURL: string };
    };
    return {
      assetId: data.result.uid,
      uploadUrl: data.result.uploadURL,
      playbackUrl: this.playbackUrl(data.result.uid),
    };
  }

  playbackUrl(assetId: string) {
    return `https://customer-stream.cloudflarestream.com/${assetId}/manifest/video.m3u8`;
  }
}

let cached: MediaProvider | null = null;

export function getMediaProvider(): MediaProvider {
  if (cached) return cached;

  const which = process.env.MEDIA_PROVIDER ?? "stub";
  if (
    which === "bunny" &&
    process.env.BUNNY_STREAM_LIBRARY_ID &&
    process.env.BUNNY_STREAM_API_KEY
  ) {
    cached = new BunnyStreamProvider(
      process.env.BUNNY_STREAM_LIBRARY_ID,
      process.env.BUNNY_STREAM_API_KEY,
      process.env.BUNNY_STREAM_CDN_HOST ?? "vz.b-cdn.net",
    );
  } else if (
    which === "cloudflare" &&
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_STREAM_TOKEN
  ) {
    cached = new CloudflareStreamProvider(
      process.env.CLOUDFLARE_ACCOUNT_ID,
      process.env.CLOUDFLARE_STREAM_TOKEN,
    );
  } else {
    cached = new StubProvider();
  }
  return cached;
}
