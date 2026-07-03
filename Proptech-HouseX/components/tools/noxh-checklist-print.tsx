"use client";

import type { NoxhEvaluation } from "@/lib/finance/noxh-eligibility";
import type { CreditAssessment } from "@/lib/finance/credit-readiness";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";

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
 * Bản in/PDF của kết quả kiểm tra + checklist hồ sơ NOXH (Value-First Hook).
 * `hidden print:block` — ẩn trên màn hình, chỉ hiện khi window.print().
 */
export function NoxhChecklistPrint({
  evaluation,
  credit,
  objectGroupLabel,
  objectGroupId,
  requiresIncome,
  intendToBorrow,
}: Props) {
  const today = new Date().toLocaleDateString("vi-VN");

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
  } else if (
    objectGroupId === "MERIT" ||
    objectGroupId === "LAND_RECOVERED"
  ) {
    checklist.push(
      "Giấy tờ chứng minh đối tượng (Quyết định NCC / Quyết định thu hồi đất) — không cần Mẫu xác nhận thu nhập dân sự.",
    );
  } else if (
    objectGroupId === "POOR_RURAL" ||
    objectGroupId === "POOR_URBAN"
  ) {
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

  return (
    <div className="hidden print:block">
      <h1 style={{ fontSize: 20, fontWeight: 800 }}>
        HouseX — Kết quả kiểm tra điều kiện mua Nhà ở xã hội
      </h1>
      <p style={{ fontSize: 12, color: "#444", marginTop: 4 }}>
        Ngày lập: {today} · Bản quy tắc: {evaluation.rulesVersion} · Căn cứ: Luật
        Nhà ở 2023, NĐ 100/2024 (sửa đổi bởi NĐ 136/2026).
      </p>

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 16 }}>
        Kết luận sơ bộ: {OVERALL_LABEL[evaluation.overall]}
      </h2>

      <table
        style={{ width: "100%", marginTop: 8, borderCollapse: "collapse", fontSize: 12 }}
      >
        <tbody>
          {[
            { k: "Đối tượng", v: evaluation.object },
            { k: "Nhà ở", v: evaluation.housing },
            { k: "Thu nhập", v: evaluation.income },
          ].map((row) => (
            <tr key={row.k}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 8px",
                  fontWeight: 700,
                  width: 90,
                  verticalAlign: "top",
                }}
              >
                {row.k}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "6px 8px" }}>
                {row.v.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {credit.applicable ? (
        <>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 16 }}>
            Khả năng vay & tín dụng
          </h2>
          <ul style={{ fontSize: 12, marginTop: 6, paddingLeft: 18 }}>
            {credit.reasons.map((r, i) => (
              <li key={i} style={{ marginBottom: 2 }}>
                {r}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {evaluation.nextSteps.length ? (
        <>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 16 }}>
            Việc cần làm tiếp theo
          </h2>
          <ul style={{ fontSize: 12, marginTop: 6, paddingLeft: 18 }}>
            {evaluation.nextSteps.map((s, i) => (
              <li key={i} style={{ marginBottom: 2 }}>
                {s}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2 style={{ fontSize: 15, fontWeight: 700, marginTop: 16 }}>
        Checklist hồ sơ cần chuẩn bị
      </h2>
      <ul style={{ fontSize: 12, marginTop: 6, paddingLeft: 18 }}>
        {checklist.map((c, i) => (
          <li key={i} style={{ marginBottom: 3 }}>
            ☐ {c}
          </li>
        ))}
      </ul>

      <p style={{ fontSize: 11, color: "#666", marginTop: 16 }}>
        *** Kết quả chỉ mang tính tham khảo, không thay thế xác nhận của cơ quan
        có thẩm quyền. Để chuyên gia HouseX tư vấn và giải thích rõ hồ sơ của bạn:
        truy cập housex.vn/lien-he.
      </p>
    </div>
  );
}
