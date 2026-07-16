import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  DTA_HAPPY_HOME_IMAGES,
  dtaHappyHomeGallery,
} from "../lib/content/dta-happy-home-images";
import {
  DTA_DEVELOPER_TAX_CODE,
  buildDtaHappyHomeLanding,
} from "../lib/content/dta-happy-home-landing";
import { buildDtaHappyHomeMock } from "../lib/preview/dta-happy-home-mock";
import { enrichProjectFromCatalog } from "../lib/data/project-public";
import {
  buildOverviewData,
  parseProjectOverview,
} from "../lib/content/project-landing";

const DTA_SLUG = "dta-happy-home-nhon-trach";
const LOCAL_PREFIX = "/images/projects/dta-happy-home/";

function allDtaImageUrls(): string[] {
  const img = DTA_HAPPY_HOME_IMAGES;
  return [
    img.developerLogo,
    img.hero.url,
    img.locationMap.url,
    img.floorPlans.master.url,
    img.floorPlans.typicalBlock.url,
    img.floorPlans.typicalFloor.url,
    ...img.showUnits.map((u) => u.url),
    ...img.paymentPlans.map((u) => u.url),
    ...img.progress.map((u) => u.url),
  ];
}

describe("DTA Happy Home landing media (nội bộ hóa /public)", () => {
  it("mọi ảnh DTA đều là đường dẫn local, không hotlink CĐT/external", () => {
    for (const url of allDtaImageUrls()) {
      assert.ok(
        url.startsWith(LOCAL_PREFIX),
        `ảnh phải local (${LOCAL_PREFIX}...), gặp: ${url}`,
      );
      assert.doesNotMatch(
        url,
        /^https?:\/\//i,
        `ảnh không được hotlink external: ${url}`,
      );
      assert.doesNotMatch(
        url,
        /dtanhontrach\.com/i,
        `ảnh không được trỏ về dtanhontrach.com: ${url}`,
      );
    }
  });

  it("file ảnh thực sự tồn tại trong public/ (chống ảnh mất khi deploy)", () => {
    for (const url of allDtaImageUrls()) {
      const filePath = path.join(process.cwd(), "public", url);
      assert.ok(existsSync(filePath), `thiếu file ảnh trong public: ${url}`);
    }
  });

  it("gallery landing dùng ảnh local và đủ số lượng", () => {
    const gallery = dtaHappyHomeGallery();
    assert.ok(gallery.length >= 10);
    for (const item of gallery) {
      assert.ok(item.url.startsWith(LOCAL_PREFIX), `gallery hotlink: ${item.url}`);
    }
  });

  it("developerProfile có MST thật và mock dùng cùng taxCode", () => {
    const landing = buildDtaHappyHomeLanding();
    assert.equal(
      landing.developerProfile?.facts.find((f) => f.label === "Mã số thuế")
        ?.value,
      DTA_DEVELOPER_TAX_CODE,
    );
    assert.equal(landing.developerProfile?.note, undefined);
    assert.equal(landing.developerProfile?.sourceUrl, undefined);
    assert.equal(
      buildDtaHappyHomeMock().developer.taxCode,
      DTA_DEVELOPER_TAX_CODE,
    );
  });

  it("code luôn thắng: bản DB cũ 'đủ field' vẫn bị override bằng landing code", () => {
    // Giả lập 1 bản ghi DB stale/khôi phục từ backup: landing đủ field nhưng nội dung + ảnh cũ.
    const staleLanding = buildDtaHappyHomeLanding();
    staleLanding.heroImage = {
      url: "https://dtanhontrach.com/wp-content/uploads/2018/01/header-bg-1.jpg.webp",
      alt: "hero cũ (hotlink)",
    };
    staleLanding.highlights = [
      { title: "NỘI DUNG CŨ 1", text: "cũ" },
      { title: "NỘI DUNG CŨ 2", text: "cũ" },
      { title: "NỘI DUNG CŨ 3", text: "cũ" },
    ];
    staleLanding.gallery = [
      { url: "https://dtanhontrach.com/old-1.jpg", caption: "cũ 1" },
      { url: "https://dtanhontrach.com/old-2.jpg", caption: "cũ 2" },
      { url: "https://dtanhontrach.com/old-3.jpg", caption: "cũ 3" },
    ];

    const staleProject = {
      ...buildDtaHappyHomeMock(),
      overviewData: buildOverviewData(null, {
        totalUnits: 2192,
        blocks: 16,
        landing: staleLanding,
      }),
    } as ReturnType<typeof buildDtaHappyHomeMock>;

    const enriched = enrichProjectFromCatalog(staleProject, DTA_SLUG);
    const landing = parseProjectOverview(enriched.overviewData).landing;

    assert.ok(landing, "enriched landing tồn tại");
    assert.ok(
      landing!.heroImage?.url.startsWith(LOCAL_PREFIX),
      `hero phải lấy từ code (local), gặp: ${landing!.heroImage?.url}`,
    );
    assert.equal(
      landing!.highlights[0]?.title,
      buildDtaHappyHomeLanding().highlights[0]?.title,
      "highlights phải lấy từ code, không giữ bản DB cũ",
    );
    for (const g of landing!.gallery) {
      assert.ok(
        g.url.startsWith(LOCAL_PREFIX),
        `gallery sau enrich phải local: ${g.url}`,
      );
    }
  });
});
