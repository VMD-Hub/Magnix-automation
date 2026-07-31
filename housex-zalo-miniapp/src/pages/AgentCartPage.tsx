import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth-context";

const PROJECTS = [
  {
    id: "noxh-1",
    name: "NOXH An Bình",
    kind: "Nhà ở xã hội",
    lane: "noxh" as const,
    area: "Bình Dương",
    price: "Từ 980 triệu",
    tag: "Đang mở bán",
  },
  {
    id: "noxh-2",
    name: "NOXH Phú Lợi",
    kind: "Nhà ở xã hội",
    lane: "noxh" as const,
    area: "TP.HCM",
    price: "Từ 1,15 tỷ",
    tag: "Ưu tiên CTV",
  },
  {
    id: "cctm-1",
    name: "Chung cư tầm trung Riverside",
    kind: "CCTM",
    lane: "cctm" as const,
    area: "Thủ Đức",
    price: "Từ 2,1 tỷ",
    tag: "Còn quỹ",
  },
  {
    id: "cctm-2",
    name: "CCTM Green Park",
    kind: "Chung cư tầm trung",
    lane: "cctm" as const,
    area: "Hà Nội",
    price: "Từ 1,8 tỷ",
    tag: "Sắp mở",
  },
];

/** Kho sản phẩm hợp tác — SoT Giỏ hàng (không C2C marketplace). */
export function AgentCartPage() {
  const { canAgent } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "noxh" | "cctm">("all");

  const items = useMemo(
    () =>
      PROJECTS.filter((p) => (filter === "all" ? true : p.lane === filter)),
    [filter],
  );

  if (!canAgent) {
    return (
      <div className="agent-subpage">
        <p>Cần đăng nhập CTV.</p>
        <Link to="/tai-khoan">Tới Tài khoản</Link>
      </div>
    );
  }

  return (
    <div className="agent-subpage">
      <header className="agent-sub-top">
        <h1>Giỏ hàng</h1>
      </header>
      <p className="agent-sub-lead">
        Kho sản phẩm House X — NOXH &amp; chung cư tầm trung để đối tác chọn bán
        / khai báo deal.
      </p>
      <div className="agent-filter-pills">
        {(
          [
            ["all", "Tất cả"],
            ["noxh", "NOXH"],
            ["cctm", "CCTM"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={filter === id ? "is-on" : ""}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="agent-cart-grid">
        {items.map((p) => (
          <article key={p.id} className="agent-cart-card">
            <div className="agent-cart-thumb" aria-hidden />
            <div className="agent-cart-body">
              <span className="agent-pill agent-pill-active">{p.tag}</span>
              <strong>{p.name}</strong>
              <span>
                {p.kind} · {p.area}
              </span>
              <span className="agent-cart-price">{p.price}</span>
              <button
                type="button"
                className="agent-cart-cta"
                onClick={() =>
                  navigate(
                    `/agent/khai-bao?project=${encodeURIComponent(p.name)}`,
                  )
                }
              >
                Chọn để khai báo
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
