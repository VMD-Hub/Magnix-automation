import { Link } from "react-router-dom";
import { RubySurfaceOrnament } from "@/components/RubySurfaceOrnament";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  backTo?: string;
  backLabel?: string;
};

/** Ruby band gọn — dùng trên trang con (tư vấn, công cụ, tài khoản…). */
export function PageBrandHeader({
  kicker,
  title,
  lead,
  backTo,
  backLabel = "← Trang chủ",
}: Props) {
  return (
    <header className="page-brand-header">
      <RubySurfaceOrnament variant="header" />
      <div className="page-brand-header-inner">
        {backTo ? (
          <Link to={backTo} className="page-brand-back">
            {backLabel}
          </Link>
        ) : null}
        {kicker ? <p className="page-brand-kicker">{kicker}</p> : null}
        <h1 className="page-brand-title">{title}</h1>
        {lead ? <p className="page-brand-lead">{lead}</p> : null}
      </div>
      <span className="home-header-gold-line" aria-hidden />
    </header>
  );
}
