import type { ListingSearchDoc } from "./listing-doc";

/**
 * Abstraction search engine. Mặc định Meilisearch (self-host, rẻ, fuzzy + geo).
 * Có thể thay bằng Typesense bằng cách viết client khác cùng interface.
 * DB vẫn là source of record; search chỉ là index.
 */

export interface SearchParams {
  q?: string;
  filters?: string[]; // điều kiện Meili, vd: ['status = ACTIVE', 'province = "..."']
  geo?: { lat: number; lng: number; radiusKm: number };
  limit?: number;
}

export interface SearchResult {
  hits: ListingSearchDoc[];
  total: number;
}

export interface SearchClient {
  readonly name: string;
  ensureIndex(): Promise<void>;
  indexListings(docs: ListingSearchDoc[]): Promise<void>;
  deleteListing(id: string): Promise<void>;
  search(params: SearchParams): Promise<SearchResult>;
}

const INDEX = "listings";

class MeiliClient implements SearchClient {
  readonly name = "meilisearch";
  constructor(
    private host: string,
    private apiKey: string,
  ) {}

  private async req(path: string, init: RequestInit) {
    const res = await fetch(`${this.host}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Meili ${path} failed: ${res.status} ${await res.text()}`);
    }
    return res.json();
  }

  async ensureIndex() {
    await this.req(`/indexes`, {
      method: "POST",
      body: JSON.stringify({ uid: INDEX, primaryKey: "id" }),
    }).catch(() => undefined); // đã tồn tại thì bỏ qua
    await this.req(`/indexes/${INDEX}/settings`, {
      method: "PATCH",
      body: JSON.stringify({
        filterableAttributes: [
          "status",
          "transactionType",
          "propertyType",
          "province",
          "district",
          "tier",
          "verified",
          "price",
          "_geo",
        ],
        sortableAttributes: ["price", "createdAt", "rankScore", "_geo"],
        searchableAttributes: [
          "description",
          "projectName",
          "district",
          "province",
          "propertyType",
          "code",
        ],
      }),
    });
  }

  async indexListings(docs: ListingSearchDoc[]) {
    if (docs.length === 0) return;
    await this.req(`/indexes/${INDEX}/documents`, {
      method: "POST",
      body: JSON.stringify(docs),
    });
  }

  async deleteListing(id: string) {
    await this.req(`/indexes/${INDEX}/documents/${id}`, { method: "DELETE" });
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const filters = [...(params.filters ?? [])];
    const sort: string[] = [];
    if (params.geo) {
      const meters = Math.round(params.geo.radiusKm * 1000);
      filters.push(`_geoRadius(${params.geo.lat}, ${params.geo.lng}, ${meters})`);
      sort.push(`_geoPoint(${params.geo.lat}, ${params.geo.lng}):asc`);
    } else if (!params.q) {
      // Không có từ khoá → ưu tiên rankScore (giữ relevance khi có q).
      sort.push("rankScore:desc");
    }
    const body = {
      q: params.q ?? "",
      filter: filters.length ? filters.join(" AND ") : undefined,
      sort: sort.length ? sort : undefined,
      limit: params.limit ?? 20,
    };
    const data = (await this.req(`/indexes/${INDEX}/search`, {
      method: "POST",
      body: JSON.stringify(body),
    })) as { hits: ListingSearchDoc[]; estimatedTotalHits: number };
    return { hits: data.hits, total: data.estimatedTotalHits };
  }
}

let cached: SearchClient | null | undefined;

/** Trả client nếu cấu hình MEILI_HOST, ngược lại null (caller fallback DB). */
export function getSearchClient(): SearchClient | null {
  if (cached !== undefined) return cached;
  if (process.env.MEILI_HOST) {
    cached = new MeiliClient(
      process.env.MEILI_HOST,
      process.env.MEILI_MASTER_KEY ?? "",
    );
  } else {
    cached = null;
  }
  return cached;
}
