/**
 * Mock UI Agent — Citics-lite.
 * Cấu trúc đã duyệt (SoT): Proptech-HouseX/docs/ops/AGENT_MINIAPP_UI_APPROVED.md
 * Xem: /mock-agent.html — không gắn API.
 */
import { useState } from "react";
import "./mock-agent.css";

type Screen =
  | "home"
  | "personal"
  | "declare"
  | "cart"
  | "journey"
  | "commission"
  | "account"
  | "notify";

const CART_PROJECTS = [
  {
    id: "noxh-1",
    name: "NOXH An Bình",
    kind: "Nhà ở xã hội",
    area: "Bình Dương",
    price: "Từ 980 triệu",
    tag: "Đang mở bán",
  },
  {
    id: "noxh-2",
    name: "NOXH Phú Lợi",
    kind: "Nhà ở xã hội",
    area: "TP.HCM",
    price: "Từ 1,15 tỷ",
    tag: "Ưu tiên CTV",
  },
  {
    id: "cctm-1",
    name: "Chung cư tầm trung Riverside",
    kind: "CCTM",
    area: "Thủ Đức",
    price: "Từ 2,1 tỷ",
    tag: "Còn quỹ",
  },
  {
    id: "cctm-2",
    name: "CCTM Green Park",
    kind: "Chung cư tầm trung",
    area: "Hà Nội",
    price: "Từ 1,8 tỷ",
    tag: "Sắp mở",
  },
];

const SERVICES = [
  { id: "noxh", label: "Bán NOXH", status: "active" as const },
  { id: "vay", label: "Vay thế chấp", status: "active" as const },
  { id: "tham-dinh", label: "Kinh doanh thẩm định", status: "pending" as const },
  { id: "telesales", label: "Telesales", status: "locked" as const },
];

const PERSONAL = [
  {
    id: "hh",
    title: "Quản lý hoa hồng",
    desc: "Theo dõi đối soát sau HĐMB — chi tiết trong tài khoản",
    screen: "commission" as Screen,
  },
  {
    id: "journey",
    title: "Hành trình chăm sóc",
    desc: "Gặp · thăm DA · cọc · HĐMB — lưu từng bước",
    screen: "journey" as Screen,
  },
  {
    id: "declare",
    title: "Khai báo giao dịch",
    desc: "Khách + dự án + mức hợp tác trên từng deal",
    screen: "declare" as Screen,
  },
  {
    id: "affiliate",
    title: "Giới thiệu đối tác",
    desc: "Chia sẻ mã / link cộng tác viên",
    screen: "home" as Screen,
  },
];

const TOOLS = [
  { id: "cashflow", label: "Excel dòng tiền vay" },
  { id: "checklist", label: "Checklist hồ sơ NOXH" },
  { id: "dk-vay", label: "Ước điều kiện vay" },
  { id: "script", label: "Script tư vấn" },
];

const DOCS = [
  { id: "policy", label: "Chính sách cộng tác" },
  { id: "train", label: "Tài liệu đào tạo" },
  { id: "econtract", label: "Mẫu e-contract" },
  { id: "sop", label: "SOP chăm sóc deal" },
];

const EVENT_BANNERS = [
  {
    id: "aff-noxh",
    kicker: "Chương trình đối tác",
    title: "Đồng hành nhà ở quốc gia — chọn mức hợp tác theo từng giao dịch",
    cta: "Khai báo deal",
    screen: "declare" as Screen,
  },
  {
    id: "cart-open",
    kicker: "Kho dự án",
    title: "NOXH & CCTM đang mở bán — chọn sản phẩm để hợp tác",
    cta: "Xem Giỏ hàng",
    screen: "cart" as Screen,
  },
  {
    id: "docs-train",
    kicker: "Đào tạo đối tác",
    title: "Chính sách cộng tác & tài liệu hội nhập — đọc trước khi bán",
    cta: "Xem Tài liệu",
    screen: "home" as Screen,
  },
];

const JOURNEY_STEPS = [
  { id: "meet", label: "Gặp khách", done: true },
  { id: "chat", label: "Chat / gọi", done: true },
  { id: "visit", label: "Thăm dự án", done: false, highlight: true },
  { id: "deposit", label: "Ký cọc", done: false },
  { id: "spa", label: "Ký HĐMB", done: false },
];

const TIERS = [
  { id: "1", name: "Connector", hint: "Chỉ nối — House X tư vấn chốt" },
  { id: "2", name: "Consultant", hint: "Tư vấn đầu + phối hợp HS" },
  { id: "3", name: "Developer Partner", hint: "Đồng hành hồ sơ NOXH" },
  { id: "4", name: "Master Broker", hint: "A–Z (cần đủ điều kiện)" },
];

export function MockAgentPreview() {
  const [screen, setScreen] = useState<Screen>("home");
  const [helpOpen, setHelpOpen] = useState(false);
  const [tier, setTier] = useState("1");

  return (
    <div className="mock-root">
      <div className="mock-chrome">
        <p className="mock-chrome-label">
          Mock UI · HouseX Agent (Citics-lite) · chỉ mobile · chưa gắn API
        </p>
        <div className="mock-phone">
          <div className="mock-phone-notch" aria-hidden />
          <div className="mock-phone-screen">
            {screen === "home" && (
              <HomeScreen
                onNavigate={setScreen}
                onOpenHelp={() => setHelpOpen(true)}
              />
            )}
            {screen === "personal" && (
              <PersonalScreen
                onBack={() => setScreen("home")}
                onNavigate={setScreen}
              />
            )}
            {screen === "declare" && (
              <DeclareScreen
                tier={tier}
                setTier={setTier}
                onBack={() => setScreen("home")}
              />
            )}
            {screen === "cart" && (
              <CartScreen onPickDeclare={() => setScreen("declare")} />
            )}
            {screen === "journey" && (
              <JourneyScreen onBack={() => setScreen("home")} />
            )}
            {screen === "commission" && (
              <CommissionScreen onBack={() => setScreen("home")} />
            )}
            {screen === "account" && (
              <AccountScreen onBack={() => setScreen("home")} />
            )}
            {screen === "notify" && (
              <NotifyScreen onBack={() => setScreen("home")} />
            )}

            <nav className="mock-tabbar" aria-label="Tabbar mock">
              <TabBtn
                active={screen === "home" || screen === "personal"}
                label="Agent"
                onClick={() => setScreen("home")}
              />
              <TabBtn
                active={screen === "declare"}
                label="Khai báo"
                onClick={() => setScreen("declare")}
              />
              <TabBtn
                active={screen === "cart"}
                label="Giỏ hàng"
                center
                onClick={() => setScreen("cart")}
              />
              <TabBtn
                active={screen === "notify"}
                label="Thông báo"
                badge="3"
                onClick={() => setScreen("notify")}
              />
              <TabBtn
                active={screen === "account"}
                label="Tài khoản"
                onClick={() => setScreen("account")}
              />
            </nav>

            {screen !== "declare" && (
              <button
                type="button"
                className="mock-fab"
                aria-label="Cần trợ giúp"
                onClick={() => setHelpOpen(true)}
              >
                <span className="mock-fab-icon" aria-hidden />
              </button>
            )}

            {helpOpen && (
              <HelpModal onClose={() => setHelpOpen(false)} />
            )}
          </div>
        </div>
        <p className="mock-chrome-hint">
          So sánh Citics: dịch vụ · sự kiện · quản lý cá nhân · Công cụ/Tài liệu
          (tab + ô nhỏ) · Giỏ hàng giữa · FAB. SoT: A+B+C, CS, HH sau HĐMB.
        </p>
        <p className="mock-chrome-links">
          <a href="/mock-agent.html">Làm mới mock</a>
          {" · "}
          <a href="/#/start">Về Start</a>
        </p>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  label,
  badge,
  center,
  onClick,
}: {
  active: boolean;
  label: string;
  badge?: string;
  center?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`mock-tab ${active ? "is-active" : ""} ${center ? "mock-tab-center" : ""}`}
      onClick={onClick}
      aria-label={center ? "Giỏ hàng — kho dự án hợp tác" : undefined}
    >
      <span
        className={`mock-tab-ico ${center ? "mock-tab-ico-cart" : ""}`}
        aria-hidden
      />
      {badge ? <span className="mock-tab-badge">{badge}</span> : null}
      <span>{label}</span>
    </button>
  );
}

function HomeScreen({
  onNavigate,
  onOpenHelp,
}: {
  onNavigate: (s: Screen) => void;
  onOpenHelp: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const banner = EVENT_BANNERS[slide] ?? EVENT_BANNERS[0];

  return (
    <div className="mock-page">
      <header className="mock-hero">
        <div className="mock-hero-row">
          <div className="mock-avatar" aria-hidden />
          <div>
            <p className="mock-hero-name">Nguyễn Văn A</p>
            <p className="mock-hero-meta">CTV · đã xác thực</p>
          </div>
          <button type="button" className="mock-gear" aria-label="Cài đặt">
            ⚙
          </button>
        </div>
      </header>

      <div className="mock-sheet">
        <h2 className="mock-h2">Dịch vụ</h2>
        <div className="mock-service-grid">
          {SERVICES.map((s) => (
            <button key={s.id} type="button" className="mock-service-cell">
              <span className={`mock-service-ico status-${s.status}`} />
              <span className="mock-service-label">{s.label}</span>
              {s.status === "pending" ? (
                <span className="mock-pill mock-pill-warn">Chờ duyệt</span>
              ) : null}
              {s.status === "locked" ? (
                <span className="mock-pill mock-pill-muted">Khóa</span>
              ) : null}
              {s.status === "active" ? (
                <span className="mock-pill mock-pill-ok">Hoạt động</span>
              ) : null}
            </button>
          ))}
        </div>

        <h2 className="mock-h2 mock-h2-spaced">Sự kiện đang diễn ra</h2>
        <div className="mock-banner-slider">
          <div className="mock-banner">
            <p className="mock-banner-kicker">{banner.kicker}</p>
            <p className="mock-banner-title">{banner.title}</p>
            <button
              type="button"
              className="mock-banner-cta"
              onClick={() => onNavigate(banner.screen)}
            >
              {banner.cta}
            </button>
          </div>
          <div className="mock-banner-dots" role="tablist" aria-label="Slide sự kiện">
            {EVENT_BANNERS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={i === slide}
                aria-label={`Banner ${i + 1}`}
                className={`mock-banner-dot ${i === slide ? "is-on" : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>

        <div className="mock-section-head">
          <h2 className="mock-h2">Quản lý cá nhân</h2>
          <button
            type="button"
            className="mock-link"
            onClick={() => onNavigate("personal")}
          >
            Xem tất cả
          </button>
        </div>
        <div className="mock-list">
          {PERSONAL.slice(0, 3).map((item) => (
            <button
              key={item.id}
              type="button"
              className="mock-list-row"
              onClick={() => onNavigate(item.screen)}
            >
              <span className="mock-list-ico" aria-hidden />
              <span className="mock-list-text">
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </span>
              <span className="mock-chevron" aria-hidden>
                ›
              </span>
            </button>
          ))}
        </div>

        <ToolsDocsSection />

        <p className="mock-footnote">
          Mock — bấm FAB hoặc tab để xem các màn.{" "}
          <button type="button" className="mock-link" onClick={onOpenHelp}>
            Mở trợ giúp
          </button>
        </p>
      </div>
    </div>
  );
}

function ToolsDocsSection() {
  const [tab, setTab] = useState<"tools" | "docs">("tools");
  const items = tab === "tools" ? TOOLS : DOCS;

  return (
    <section className="mock-tools-docs" aria-label="Công cụ và tài liệu">
      <div className="mock-tools-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "tools"}
          className={tab === "tools" ? "is-on" : ""}
          onClick={() => setTab("tools")}
        >
          Công cụ
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "docs"}
          className={tab === "docs" ? "is-on" : ""}
          onClick={() => setTab("docs")}
        >
          Tài liệu
        </button>
      </div>
      <div className="mock-mini-grid" role="tabpanel">
        {items.map((item) => (
          <button key={item.id} type="button" className="mock-mini-cell">
            <span className="mock-mini-ico" aria-hidden />
            <span className="mock-mini-label">{item.label}</span>
          </button>
        ))}
      </div>
      <p className="mock-tools-hint">
        {tab === "tools"
          ? "Công cụ bán hàng & thẩm định nhanh (mock)."
          : "Chính sách cộng tác · đào tạo · SOP (mock)."}
      </p>
    </section>
  );
}

function PersonalScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar">
        <button type="button" className="mock-back" onClick={onBack}>
          ‹
        </button>
        <h1>Quản lý cá nhân</h1>
      </div>
      <div className="mock-list mock-list-pad">
        {PERSONAL.map((item) => (
          <button
            key={item.id}
            type="button"
            className="mock-list-row"
            onClick={() => onNavigate(item.screen)}
          >
            <span className="mock-list-ico" aria-hidden />
            <span className="mock-list-text">
              <strong>{item.title}</strong>
              <span>{item.desc}</span>
            </span>
            <span className="mock-chevron">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}



function CartScreen({ onPickDeclare }: { onPickDeclare: () => void }) {
  const [filter, setFilter] = useState<"all" | "noxh" | "cctm">("all");
  const items = CART_PROJECTS.filter((p) => {
    if (filter === "noxh") return p.kind.toLowerCase().includes("xã hội");
    if (filter === "cctm") return !p.kind.toLowerCase().includes("xã hội");
    return true;
  });

  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar">
        <h1>Giỏ hàng</h1>
      </div>
      <div className="mock-form" style={{ paddingTop: 8 }}>
        <p className="mock-form-lead">
          Kho sản phẩm House X — NOXH &amp; chung cư tầm trung để đối tác chọn
          bán / khai báo deal.
        </p>
        <div className="mock-notify-tabs" style={{ padding: "0 0 12px" }}>
          <button
            type="button"
            className={filter === "all" ? "is-on" : ""}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={filter === "noxh" ? "is-on" : ""}
            onClick={() => setFilter("noxh")}
          >
            NOXH
          </button>
          <button
            type="button"
            className={filter === "cctm" ? "is-on" : ""}
            onClick={() => setFilter("cctm")}
          >
            CCTM
          </button>
        </div>
        <div className="mock-cart-grid">
          {items.map((p) => (
            <article key={p.id} className="mock-cart-card">
              <div className="mock-cart-thumb" aria-hidden />
              <div className="mock-cart-body">
                <span className="mock-pill mock-pill-ok">{p.tag}</span>
                <strong>{p.name}</strong>
                <span>
                  {p.kind} · {p.area}
                </span>
                <span className="mock-cart-price">{p.price}</span>
                <button
                  type="button"
                  className="mock-cart-cta"
                  onClick={onPickDeclare}
                >
                  Chọn để khai báo
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeclareScreen({
  tier,
  setTier,
  onBack,
}: {
  tier: string;
  setTier: (t: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar">
        <button type="button" className="mock-back" onClick={onBack}>
          ‹
        </button>
        <h1>Khai báo giao dịch</h1>
      </div>
      <div className="mock-form">
        <p className="mock-form-lead">
          Chọn khách (A), dự án (B) và mức hợp tác (C) — House X bố trí hỗ trợ
          theo lựa chọn của bạn.
        </p>
        <label className="mock-field">
          <span>A · Khách hàng</span>
          <input placeholder="Họ tên / SĐT khách" defaultValue="" />
        </label>
        <label className="mock-field">
          <span>B · Dự án / sản phẩm</span>
          <input placeholder="Chọn hoặc gõ tên dự án" />
        </label>
        <p className="mock-field-label">C · Mức hợp tác trên deal này</p>
        <div className="mock-tier-list">
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`mock-tier ${tier === t.id ? "is-on" : ""}`}
              onClick={() => setTier(t.id)}
            >
              <strong>{t.name}</strong>
              <span>{t.hint}</span>
            </button>
          ))}
        </div>
        <button type="button" className="mock-primary">
          Gửi khai báo
        </button>
        <p className="mock-footnote">
          Mock: chưa gọi API. Đổi mức sau khi Ops đã gọi sẽ bị khóa (SoT).
        </p>
      </div>
    </div>
  );
}

function JourneyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar">
        <button type="button" className="mock-back" onClick={onBack}>
          ‹
        </button>
        <h1>Hành trình CS</h1>
      </div>
      <div className="mock-form">
        <p className="mock-form-lead">
          Deal · Nguyễn Thị B · NOXH mẫu — đối tác hoặc ghép House X; mỗi bước
          cần note + ảnh.
        </p>
        <ol className="mock-steps">
          {JOURNEY_STEPS.map((s, i) => (
            <li
              key={s.id}
              className={`mock-step ${s.done ? "is-done" : ""} ${s.highlight ? "is-next" : ""}`}
            >
              <span className="mock-step-num">{i + 1}</span>
              <div>
                <strong>{s.label}</strong>
                <span>
                  {s.done
                    ? "Đã lưu · có bằng chứng"
                    : s.highlight
                      ? "Bước tiếp — đăng ký lịch + ảnh"
                      : "Chưa tới"}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <button type="button" className="mock-primary">
          Cập nhật bước (note + ảnh)
        </button>
        <p className="mock-footnote">
          Thưởng thăm DA +500k: Admin xác minh với CĐT sau khi có bước thăm +
          HĐMB.
        </p>
      </div>
    </div>
  );
}

function CommissionScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar mock-topbar-blue">
        <button type="button" className="mock-back light" onClick={onBack}>
          ‹
        </button>
        <h1>Quản lý hoa hồng</h1>
      </div>
      <div className="mock-hh-card">
        <p className="mock-hh-label">Hoa hồng khả dụng</p>
        <p className="mock-hh-value">— đ</p>
        <p className="mock-hh-note">
          Hiện sau khi Ops/Super nhập giá HĐMB (chưa VAT). Trước đó chỉ xem tiến
          độ deal.
        </p>
      </div>
      <div className="mock-form">
        <div className="mock-hh-row">
          <span>Deal Connector</span>
          <span>Chờ HĐMB</span>
        </div>
        <div className="mock-hh-row">
          <span>Thưởng thăm DA</span>
          <span>Chờ Admin xác minh</span>
        </div>
      </div>
    </div>
  );
}

function AccountScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar">
        <button type="button" className="mock-back" onClick={onBack}>
          ‹
        </button>
        <h1>Tài khoản</h1>
      </div>
      <div className="mock-form">
        <div className="mock-verify">
          <strong>Trạng thái tài khoản</strong>
          <span>Đã xác thực · E-contract đã ký (mock)</span>
        </div>
        <h2 className="mock-h2">Quản lý dịch vụ</h2>
        {SERVICES.map((s) => (
          <div key={s.id} className="mock-list-row static">
            <span className="mock-list-text">
              <strong>{s.label}</strong>
              <span>
                {s.status === "active"
                  ? "Đang hoạt động"
                  : s.status === "pending"
                    ? "Đang chờ duyệt"
                    : "Chờ đủ điều kiện"}
              </span>
            </span>
            <span
              className={`mock-pill ${s.status === "active" ? "mock-pill-ok" : s.status === "pending" ? "mock-pill-warn" : "mock-pill-muted"}`}
            >
              {s.status === "active"
                ? "ON"
                : s.status === "pending"
                  ? "Chờ"
                  : "Khóa"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="mock-page mock-page-plain">
      <div className="mock-topbar">
        <button type="button" className="mock-back" onClick={onBack}>
          ‹
        </button>
        <h1>Thông báo</h1>
      </div>
      <div className="mock-notify-tabs">
        <span className="is-on">Tất cả</span>
        <span>Hệ thống</span>
        <span>Hoa hồng</span>
      </div>
      <div className="mock-list mock-list-pad">
        <div className="mock-list-row static">
          <span className="mock-list-text">
            <strong>Lead đã được Ops tiếp nhận</strong>
            <span>Deal Connector · khách Nguyễn Thị B</span>
          </span>
        </div>
        <div className="mock-list-row static">
          <span className="mock-list-text">
            <strong>Nhắc cập nhật chăm sóc</strong>
            <span>Còn 5 ngày trước hạn im 30 ngày</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="mock-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="mock-modal"
        role="dialog"
        aria-labelledby="mock-help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mock-modal-ico" aria-hidden />
        <h2 id="mock-help-title">Cần trợ giúp?</h2>
        <p>Chọn kênh hỗ trợ đối tác (P0 — AI bổ sung sau)</p>
        <div className="mock-help-rows">
          <a href="tel:0826600800">Số điện thoại · 0826600800</a>
          <a href="mailto:vunguyen@timnhaxahoi.com">Email hỗ trợ</a>
          <a href="https://zalo.me/timnhaxahoi">Zalo OA</a>
        </div>
        <button type="button" className="mock-primary" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
