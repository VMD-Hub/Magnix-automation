import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { IconHeadset } from "@/components/AppIcons";

type PillStatus = "active" | "pending" | "locked";

const SERVICES: Array<{
  id: string;
  label: string;
  status: PillStatus;
  to: string;
}> = [
  { id: "noxh", label: "Bán NOXH", status: "active", to: "/agent/ho-so" },
  {
    id: "vay",
    label: "Vay thế chấp",
    status: "active",
    to: "/agent/dich-vu?tab=product",
  },
  {
    id: "tham-dinh",
    label: "Kinh doanh thẩm định",
    status: "pending",
    to: "/agent/dich-vu?tab=training",
  },
  {
    id: "telesales",
    label: "Telesales",
    status: "locked",
    to: "/agent/telesales",
  },
];

const EVENT_BANNERS = [
  {
    id: "aff",
    kicker: "Chương trình đối tác",
    title: "Đồng hành nhà ở quốc gia — chọn mức hợp tác theo từng giao dịch",
    cta: "Khai báo deal",
    to: "/agent/khai-bao",
  },
  {
    id: "cart",
    kicker: "Kho dự án",
    title: "NOXH & CCTM đang mở bán — chọn sản phẩm để hợp tác",
    cta: "Xem Giỏ hàng",
    to: "/agent/gio-hang",
  },
  {
    id: "docs",
    kicker: "Đào tạo đối tác",
    title: "Chính sách cộng tác & tài liệu hội nhập — đọc trước khi bán",
    cta: "Xem Tài liệu",
    to: "/agent#tai-lieu",
  },
];

const PERSONAL = [
  {
    title: "Quản lý hoa hồng",
    desc: "Theo dõi đối soát sau HĐMB",
    to: "/agent/hoa-hong",
  },
  {
    title: "Hành trình chăm sóc",
    desc: "Gặp · thăm DA · cọc · HĐMB — lưu từng bước",
    to: "/agent/ho-so",
  },
  {
    title: "Khai báo giao dịch",
    desc: "Khách + dự án + mức hợp tác trên từng deal",
    to: "/agent/khai-bao",
  },
];

const TOOLS = [
  { id: "cashflow", label: "Excel dòng tiền vay", to: "/cong-cu" },
  { id: "checklist", label: "Checklist hồ sơ NOXH", to: "/agent/dich-vu?tab=legal" },
  { id: "dk-vay", label: "Ước điều kiện vay", to: "/cong-cu" },
  { id: "script", label: "Script tư vấn", to: "/agent/dich-vu?tab=training" },
];

const DOCS = [
  { id: "policy", label: "Chính sách cộng tác", to: "/agent/dich-vu?tab=legal" },
  { id: "train", label: "Tài liệu đào tạo", to: "/agent/dich-vu?tab=training" },
  { id: "econtract", label: "Mẫu e-contract", to: "/agent/e-contract" },
  { id: "sop", label: "SOP chăm sóc deal", to: "/agent/dich-vu?tab=training" },
];

function pillLabel(s: PillStatus) {
  if (s === "active") return "Hoạt động";
  if (s === "pending") return "Chờ duyệt";
  return "Khóa";
}

/**
 * Agent home — SoT UI đã duyệt (Citics-lite).
 * docs/ops/AGENT_MINIAPP_UI_APPROVED.md
 */
export function AgentHomePage() {
  const { canAgent, user } = useAuth();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [toolsTab, setToolsTab] = useState<"tools" | "docs">("tools");
  const banner = EVENT_BANNERS[slide] ?? EVENT_BANNERS[0];
  const miniItems = toolsTab === "tools" ? TOOLS : DOCS;

  if (!canAgent) {
    return (
      <div className="agent-home">
        <header className="agent-hero">
          <p className="agent-hero-name">Khu vực môi giới</p>
          <p className="agent-hero-meta">Đăng nhập CTV để mở Agent</p>
        </header>
        <div className="agent-sheet">
          <Link className="btn" to="/tai-khoan">
            Tới Tài khoản
          </Link>
        </div>
      </div>
    );
  }

  const verified =
    Boolean(user?.ctvCode) || user?.brokerType === "CTV" || user?.role === "BROKER";

  return (
    <div className="agent-home">
      <header className="agent-hero">
        <div className="agent-hero-row">
          <div className="agent-avatar" aria-hidden />
          <div>
            <p className="agent-hero-name">{user?.name ?? "Đối tác"}</p>
            <p className="agent-hero-meta">
              {verified ? "CTV · đã xác thực" : "CTV · chờ xác thực"}
              {user?.ctvCode ? ` · ${user.ctvCode}` : null}
            </p>
          </div>
          <Link to="/tai-khoan" className="agent-gear" aria-label="Cài đặt">
            ⚙
          </Link>
        </div>
      </header>

      <div className="agent-sheet">
        <h2 className="agent-h2">Dịch vụ</h2>
        <div className="agent-service-grid">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              className="agent-service-cell"
              onClick={() => navigate(s.to)}
            >
              <span className={`agent-service-ico status-${s.status}`} />
              <span className="agent-service-label">{s.label}</span>
              <span className={`agent-pill agent-pill-${s.status}`}>
                {pillLabel(s.status)}
              </span>
            </button>
          ))}
        </div>

        <h2 className="agent-h2 agent-h2-spaced">Sự kiện đang diễn ra</h2>
        <div className="agent-banner-slider">
          <div className="agent-banner">
            <p className="agent-banner-kicker">{banner.kicker}</p>
            <p className="agent-banner-title">{banner.title}</p>
            <button
              type="button"
              className="agent-banner-cta"
              onClick={() => {
                if (banner.to.includes("#tai-lieu")) {
                  setToolsTab("docs");
                  document
                    .getElementById("agent-tools-docs")
                    ?.scrollIntoView({ behavior: "smooth" });
                  return;
                }
                navigate(banner.to);
              }}
            >
              {banner.cta}
            </button>
          </div>
          <div className="agent-banner-dots" role="tablist" aria-label="Slide sự kiện">
            {EVENT_BANNERS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={i === slide}
                aria-label={`Banner ${i + 1}`}
                className={`agent-banner-dot ${i === slide ? "is-on" : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>

        <div className="agent-section-head">
          <h2 className="agent-h2">Quản lý cá nhân</h2>
          <Link to="/agent/hoa-hong" className="agent-link">
            Xem tất cả
          </Link>
        </div>
        <div className="agent-list">
          {PERSONAL.map((item) => (
            <Link key={item.to} to={item.to} className="agent-list-row">
              <span className="agent-list-ico" aria-hidden />
              <span className="agent-list-text">
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </span>
              <span className="agent-chevron" aria-hidden>
                ›
              </span>
            </Link>
          ))}
        </div>

        <section
          id="agent-tools-docs"
          className="agent-tools-docs"
          aria-label="Công cụ và tài liệu"
        >
          <div className="agent-tools-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={toolsTab === "tools"}
              className={toolsTab === "tools" ? "is-on" : ""}
              onClick={() => setToolsTab("tools")}
            >
              Công cụ
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={toolsTab === "docs"}
              className={toolsTab === "docs" ? "is-on" : ""}
              onClick={() => setToolsTab("docs")}
            >
              Tài liệu
            </button>
          </div>
          <div className="agent-mini-grid" role="tabpanel">
            {miniItems.map((item) => (
              <Link key={item.id} to={item.to} className="agent-mini-cell">
                <span className="agent-mini-ico" aria-hidden />
                <span className="agent-mini-label">{item.label}</span>
              </Link>
            ))}
          </div>
          <p className="agent-tools-hint">
            {toolsTab === "tools"
              ? "Công cụ bán hàng & thẩm định nhanh."
              : "Chính sách cộng tác · đào tạo · SOP."}
          </p>
        </section>

        <p className="agent-footnote">
          <IconHeadset size={14} /> Cần hỗ trợ — bấm nút tròn góc phải.
        </p>
      </div>
    </div>
  );
}
