"use client";

import type { NoxhEvaluation } from "@/lib/finance/noxh-eligibility";
import type { CreditAssessment } from "@/lib/finance/credit-readiness";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";
import { ToolPrintSheet } from "@/components/tools/print/tool-print-sheet";

type Props = {
  evaluation: NoxhEvaluation;
  credit: CreditAssessment;
  objectGroupLabel: string;
  objectGroupId: NoxhObjectGroupId;
  requiresIncome: boolean;
  intendToBorrow: boolean;
};

const OVERALL_LABEL: Record<NoxhEvaluation["overall"], string> = {
  ELIGIBLE: "Có khả năng đủ điều kiện mua NOXH",
  CONDITIONAL: "Gần đủ — cần bổ sung thông tin",
  NOT_ELIGIBLE: "Chưa đủ điều kiện mua NOXH",
};

/**
 * Bản in/PDF kết quả kiểm tra + checklist hồ sơ NOXH — header branding House X.
 */
export function NoxhChecklistPrint({
  evaluation,
  credit,
  objectGroupLabel,
  objectGroupId,
  requiresIncome,
  intendToBorrow,
}: Props) {
  const checklist: string[] = [
    "Đơn đăng ký mua/thuê mua NOXH (theo mẫu của chủ đầu tư).",
    "Giấy tờ tùy thân: Căn cước công dân/Căn cước còn hiệu lực.",
    "Giấy tờ xác nhận tình trạng hôn nhân (độc thân/kết hôn).",
    `Giấy tờ xác nhận đối tượng: ${objectGroupLabel}.`,
    "Giấy tờ xác nhận về điều kiện nhà ở (chưa có nhà / diện tích bình quân < 15 m²/người) theo Điều 29 NĐ 100/2024.",
  ];
  if (requiresIncome) {
    checklist.push(
      "Giấy xác nhận thu nhập / bảng tiền lương – tiền công 12 tháng liền kề (Điều 30 NĐ 100/2024, sửa bởi NĐ 136/2026).",
    );
  } else if (objectGroupId === "ARMED_FORCES") {
    checklist.push(
      "Giấy xác nhận đơn vị BQP/BCA: trạng thái công tác, nhà ở và thu nhập theo Điều 67 NĐ 100/2024 (mục 11.2 Mẫu 01 — không dùng trần 25/35/50 triệu).",
    );
  } else if (objectGroupId === "MERIT" || objectGroupId === "LAND_RECOVERED") {
    checklist.push(
      "Giấy tờ chứng minh đối tượng (Quyết định NCC / Quyết định thu hồi đất) — không cần Mẫu xác nhận thu nhập dân sự.",
    );
  } else if (objectGroupId === "POOR_RURAL" || objectGroupId === "POOR_URBAN") {
    checklist.push(
      "Giấy xác nhận hộ nghèo/cận nghèo theo chuẩn Chính phủ (Điều 30 k3 NĐ 100/2024).",
    );
  }
  if (intendToBorrow) {
    checklist.push(
      "Hồ sơ vay: chứng minh thu nhập trả nợ, sao kê tài khoản, tra cứu CIC.",
      "Xử lý dư nợ/hạn mức thẻ tín dụng và tình trạng nợ xấu (nếu có) trước khi nộp hồ sơ vay.",
    );
  }

  const summary = [
    { label: "Kết luận", value: OVERALL_LABEL[evaluation.overall] },
    { label: "Đối tượng", value: objectGroupLabel },
    { label: "Bản quy tắc", value: evaluation.rulesVersion },
  ];

  return (
    <ToolPrintSheet
      title="Bảng kiểm tra điều kiện mua Nhà ở xã hội"
      subtitle="Căn cứ: Luật Nhà ở 2023, NĐ 100/2024 (sửa đổi bởi NĐ 136/2026)."
      summary={summary}
    >
      <section className="tool-print-body">
        <h2 className="tool-print-section-title">Chi tiết điều kiện</h2>
        <table className="tool-print-kv-table">
          <tbody>
            {[
              { k: "Đối tượng", v: evaluation.object.reason },
              { k: "Nhà ở", v: evaluation.housing.reason },
              { k: "Thu nhập", v: evaluation.income.reason },
            ].map((row) => (
              <tr key={row.k}>
                <th>{row.k}</th>
                <td>{row.v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {credit.applicable ? (
          <>
            <h2 className="tool-print-section-title">Khả năng vay & tín dụng</h2>
            <ul className="tool-print-list">
              {credit.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </>
        ) : null}

        {evaluation.nextSteps.length ? (
          <>
            <h2 className="tool-print-section-title">Việc cần làm tiếp theo</h2>
            <ul className="tool-print-list">
              {evaluation.nextSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        ) : null}

        <h2 className="tool-print-section-title">Checklist hồ sơ cần chuẩn bị</h2>
        <ul className="tool-print-list">
          {checklist.map((c) => (
            <li key={c}>☐ {c}</li>
          ))}
        </ul>

        <p className="tool-print-disclaimer">
          *** Kết quả chỉ mang tính tham khảo, không thay thế xác nhận của cơ quan có
          thẩm quyền. Liên hệ House X qua hotline / email trên header hoặc trang Liên
          hệ.
        </p>
      </section>
    </ToolPrintSheet>
  );
}
