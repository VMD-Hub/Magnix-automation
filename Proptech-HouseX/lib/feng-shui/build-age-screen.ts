/**
 * Kiểm tra tuổi xây/sửa nhà — Tam Tai, Kim Lâu, Hoang Ốc.
 * Công thức phong thủy dân gian phổ biến tại VN (tham chiếu batdongsan, 59sdesign).
 */

import { calcLunarAge, chiIndexFromYear, chiNameFromYear } from "@/lib/feng-shui/lunar-age";

export type BuildAgeStatus = "OK" | "CAUTION" | "AVOID";

export type KimLauType = "THAN" | "THE" | "TU" | "SUC";

export type HoangOcCung =
  | "NHAT_CAT"
  | "NHI_NGHI"
  | "TAM_DIA_SAT"
  | "TU_TAN_TAI"
  | "NGU_THO_TU"
  | "LUC_HOANG_OC";

/** 4 nhóm tam hợp — phạm Tam Tai khi năm xây thuộc cùng nhóm chi với tuổi. */
const TAM_TAI_GROUPS: readonly (readonly number[])[] = [
  [0, 4, 8],
  [5, 9, 1],
  [2, 6, 10],
  [11, 3, 7],
];

const KIM_LAU: Record<number, { type: KimLauType; label: string; harm: string }> = {
  1: { type: "THAN", label: "Kim Lâu Thân", harm: "Hại bản thân gia chủ" },
  3: { type: "THE", label: "Kim Lâu Thê", harm: "Có thể ảnh hưởng vợ/chồng" },
  6: { type: "TU", label: "Kim Lâu Tử", harm: "Có thể ảnh hưởng con cái" },
  8: { type: "SUC", label: "Kim Lâu Lục Súc", harm: "Hại gia súc, tài sản nuôi trồng" },
};

const HOANG_OC: Record<
  number,
  { cung: HoangOcCung; label: string; auspicious: boolean; meaning: string }
> = {
  0: {
    cung: "LUC_HOANG_OC",
    label: "Lục Hoang Ốc",
    auspicious: false,
    meaning: "Nhà ở không ổn định, dễ tán tài, hao người",
  },
  1: {
    cung: "NHAT_CAT",
    label: "Nhất Cát",
    auspicious: true,
    meaning: "Làm nhà an nghiệp, mọi việc han thuận",
  },
  2: {
    cung: "NHI_NGHI",
    label: "Nhì Nghi",
    auspicious: true,
    meaning: "Gia đạo hòa thuận, công việc thuận lợi",
  },
  3: {
    cung: "TAM_DIA_SAT",
    label: "Tam Địa Sát",
    auspicious: false,
    meaning: "Dễ gặp tai họa, bệnh tật, thị phi",
  },
  4: {
    cung: "TU_TAN_TAI",
    label: "Tứ Tấn Tài",
    auspicious: true,
    meaning: "Tài lộc tăng tiến, làm ăn phát đạt",
  },
  5: {
    cung: "NGU_THO_TU",
    label: "Ngũ Thọ Tử",
    auspicious: false,
    meaning: "Cảnh sinh ly tán, hao người",
  },
};

export type BuildAgeScreenResult = {
  birthYear: number;
  buildYear: number;
  lunarAge: number;
  birthChi: string;
  buildChi: string;
  tamTai: { hit: boolean; meaning: string };
  kimLau: { hit: boolean; detail?: (typeof KIM_LAU)[1] };
  hoangOc: (typeof HOANG_OC)[1];
  overall: BuildAgeStatus;
  headline: string;
  summary: string;
  remedies: string[];
  nextSteps: string[];
};

function tamTaiHit(birthYear: number, buildYear: number): boolean {
  const birthChi = chiIndexFromYear(birthYear);
  const buildChi = chiIndexFromYear(buildYear);
  const group = TAM_TAI_GROUPS.find((g) => g.includes(birthChi));
  return group ? group.includes(buildChi) : false;
}

function kimLauHit(lunarAge: number): { hit: boolean; detail?: (typeof KIM_LAU)[1] } {
  const rem = lunarAge % 9;
  const detail = KIM_LAU[rem];
  return detail ? { hit: true, detail } : { hit: false };
}

function hoangOcFromAge(lunarAge: number) {
  return HOANG_OC[lunarAge % 6]!;
}

function overallStatus(
  tamTai: boolean,
  kimLau: boolean,
  hoangOcBad: boolean,
): BuildAgeStatus {
  if (tamTai || kimLau || hoangOcBad) return "AVOID";
  return "OK";
}

export function screenBuildAge(birthYear: number, buildYear: number): BuildAgeScreenResult {
  if (buildYear <= birthYear) {
    throw new Error("Năm xây phải lớn hơn năm sinh");
  }

  const lunarAge = calcLunarAge(birthYear, buildYear);
  const tamTai = tamTaiHit(birthYear, buildYear);
  const kimLau = kimLauHit(lunarAge);
  const hoangOc = hoangOcFromAge(lunarAge);
  const overall = overallStatus(tamTai, kimLau.hit, !hoangOc.auspicious);

  const issues: string[] = [];
  if (tamTai) issues.push("Tam Tai");
  if (kimLau.hit) issues.push(kimLau.detail!.label);
  if (!hoangOc.auspicious) issues.push(hoangOc.label);

  const headline =
    overall === "OK"
      ? `Năm ${buildYear} có thể động thổ — không phạm đại hạn`
      : `Năm ${buildYear} phạm ${issues.join(", ")} — cần cân nhắc`;

  const summary =
    overall === "OK"
      ? `Tuổi mụ ${lunarAge} (${chiNameFromYear(birthYear)} sinh ${birthYear}) không phạm Tam Tai, Kim Lâu hay Hoang Ốc xấu trong năm ${buildYear} (${chiNameFromYear(buildYear)}). Có thể cân nhắc động thổ sau khi đã chọn hướng nhà hợp tuổi.`
      : `Tuổi mụ ${lunarAge} trong năm ${buildYear} phạm: ${issues.join("; ")}. Nhiều gia chủ chọn mượn tuổi, đổi năm khởi công hoặc làm thủ tục hóa giải theo phong thủy.`;

  const remedies: string[] = [];
  if (overall !== "OK") {
    remedies.push(
      "Mượn tuổi: nhờ người thân hợp tuổi đứng ra động thổ, cất nóc (gia chủ nên vắng mặt lúc khởi công).",
    );
    remedies.push("Hoãn sang năm không phạm hạn — dùng công cụ thử các năm gần.");
    remedies.push("Chọn ngày giờ tốt và thủ tục cúng lễ theo hướng dẫn thầy phong thủy địa phương.");
  }

  const nextSteps = [
    "Xem hướng nhà hợp tuổi theo Bát trạch trước khi chốt mảnh đất.",
    "Ước tính chi phí xây dựng để chuẩn bị tài chính.",
    "Liên hệ House X nếu cần tư vấn chọn dự án/căn hộ phù hợp.",
  ];

  return {
    birthYear,
    buildYear,
    lunarAge,
    birthChi: chiNameFromYear(birthYear),
    buildChi: chiNameFromYear(buildYear),
    tamTai: {
      hit: tamTai,
      meaning: tamTai
        ? `Tuổi ${chiNameFromYear(birthYear)} phạm Tam Tai năm ${chiNameFromYear(buildYear)} — tránh động thổ lớn`
        : "Không phạm Tam Tai",
    },
    kimLau,
    hoangOc,
    overall,
    headline,
    summary,
    remedies,
    nextSteps,
  };
}

export function suggestGoodYears(
  birthYear: number,
  fromYear: number,
  count = 5,
): number[] {
  const good: number[] = [];
  for (let y = fromYear; y <= fromYear + 12 && good.length < count; y += 1) {
    if (y <= birthYear + 17) continue;
    try {
      const r = screenBuildAge(birthYear, y);
      if (r.overall === "OK") good.push(y);
    } catch {
      /* skip */
    }
  }
  return good;
}

export const BUILD_AGE_DISCLAIMER =
  "Kết quả theo công thức phong thủy dân gian (Tam Tai, Kim Lâu, Hoang Ốc) — tham khảo văn hóa, không thay tư vấn chuyên gia. Nên kết hợp hướng nhà, thế đất và điều kiện thực tế.";

export function buildAgeStatusLabel(s: BuildAgeStatus): string {
  return s === "OK" ? "Hợp tuổi" : s === "CAUTION" ? "Cần xem thêm" : "Phạm hạn";
}
