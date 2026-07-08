import type { NoxhDocStatus, NoxhDocType } from "@prisma/client";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";
import { NOXH_OBJECT_GROUPS } from "@/lib/finance/noxh-rules";

export type DocCatalogEntry = {
  docType: NoxhDocType;
  label: string;
  ctvActionHint: string;
  initialStatus: NoxhDocStatus;
};

const BASE_DOCS: Omit<DocCatalogEntry, "initialStatus">[] = [
  {
    docType: "DOC_ID",
    label: "CMND/CCCD còn hiệu lực",
    ctvActionHint: "Nhắc khách chuẩn bị bản sao công chứng CCCD.",
  },
  {
    docType: "DOC_MARRIAGE",
    label: "Giấy tờ hôn nhân (độc thân/kết hôn)",
    ctvActionHint: "Nhắc khách xin xác nhận tình trạng hôn nhân tại UBND.",
  },
  {
    docType: "DOC_RESIDENCE",
    label: "Giấy xác nhận cư trú",
    ctvActionHint:
      "Nhắc khách ra Công an xã nơi cư trú — mang CCCD và sổ hộ khẩu.",
  },
  {
    docType: "DOC_OBJECT",
    label: "Xác nhận đối tượng mua NOXH (Đ.76)",
    ctvActionHint: "Nhắc khách xin giấy xác nhận đối tượng tại đơn vị.",
  },
  {
    docType: "DOC_HOUSING",
    label: "Xác nhận điều kiện nhà ở (<15m²/người)",
    ctvActionHint:
      "Nhắc khách xin xác nhận diện tích nhà đang ở tại UBND.",
  },
  {
    docType: "DOC_INCOME",
    label: "Xác nhận thu nhập 12 tháng",
    ctvActionHint:
      "Nhắc khách xin giấy tại phòng Nhân sự — cần bảng lương 12 tháng.",
  },
];

const LOAN_DOCS: Omit<DocCatalogEntry, "initialStatus">[] = [
  {
    docType: "DOC_CIC",
    label: "Tra cứu CIC / xử lý nợ xấu",
    ctvActionHint:
      "Nhắc khách thanh toán nợ thẻ/nợ quá hạn trước khi nộp vay.",
  },
  {
    docType: "DOC_BANK_INCOME",
    label: "Chứng minh thu nhập cho ngân hàng",
    ctvActionHint: "Nhắc khách chuẩn bị sao kê lương 6 tháng.",
  },
  {
    docType: "DOC_LOAN_APP",
    label: "Hồ sơ vay NHCSXH / ngân hàng",
    ctvActionHint: "HouseX sẽ hướng dẫn mẫu hồ sơ vay khi đủ điều kiện mua.",
  },
];

function objectDocHint(objectGroup: NoxhObjectGroupId): string {
  if (objectGroup === "ARMED_FORCES") {
    return "Liên hệ đơn vị quân đội/công an để lấy Mẫu 01 (Đ.67 NĐ 100).";
  }
  if (objectGroup === "MERIT" || objectGroup === "LAND_RECOVERED") {
    return "Chuẩn bị Quyết định NCC hoặc QĐ thu hồi đất.";
  }
  if (objectGroup === "POOR_RURAL" || objectGroup === "POOR_URBAN") {
    return "Xin giấy xác nhận hộ nghèo/cận nghèo theo chuẩn Chính phủ.";
  }
  return "Nhắc khách xin giấy xác nhận đối tượng tại đơn vị công tác.";
}

/** Sinh checklist giấy tờ theo nhóm đối tượng & nhu cầu vay. */
export function buildDocumentChecklist(params: {
  objectGroup: NoxhObjectGroupId;
  intendToBorrow: boolean;
}): DocCatalogEntry[] {
  const group = NOXH_OBJECT_GROUPS[params.objectGroup] ?? NOXH_OBJECT_GROUPS.WORKER;
  const requiresIncome = group.requiresIncome;

  const docs: DocCatalogEntry[] = BASE_DOCS.map((d) => {
    if (d.docType === "DOC_OBJECT") {
      return {
        ...d,
        ctvActionHint: objectDocHint(params.objectGroup),
        initialStatus: "MISSING" as NoxhDocStatus,
      };
    }
    if (d.docType === "DOC_INCOME") {
      return {
        ...d,
        initialStatus: requiresIncome
          ? ("MISSING" as NoxhDocStatus)
          : ("NOT_REQUIRED" as NoxhDocStatus),
      };
    }
    return { ...d, initialStatus: "MISSING" as NoxhDocStatus };
  });

  docs.push({
    docType: "DOC_APPLICATION",
    label: "Đơn đăng ký mua NOXH (mẫu CĐT)",
    ctvActionHint: "HouseX cung cấp mẫu khi sẵn sàng nộp hồ sơ.",
    initialStatus: "MISSING",
  });

  if (params.intendToBorrow) {
    docs.push(
      ...LOAN_DOCS.map((d) => ({
        ...d,
        initialStatus: "MISSING" as NoxhDocStatus,
      })),
    );
  }

  return docs;
}

export const DOC_STATUS_LABEL: Record<NoxhDocStatus, string> = {
  NOT_REQUIRED: "Không áp dụng",
  MISSING: "Chưa có",
  RECEIVED: "Đã nộp — đang kiểm",
  REVIEWING: "Đang kiểm tra",
  PASSED: "Đã đạt",
  REJECTED: "Cần làm lại",
  EXPIRED: "Hết hạn",
};

export function countDocProgress(
  docs: { status: NoxhDocStatus }[],
): { passed: number; required: number; percent: number } {
  const required = docs.filter((d) => d.status !== "NOT_REQUIRED");
  const passed = required.filter((d) => d.status === "PASSED");
  const percent =
    required.length === 0
      ? 0
      : Math.round((passed.length / required.length) * 100);
  return { passed: passed.length, required: required.length, percent };
}
