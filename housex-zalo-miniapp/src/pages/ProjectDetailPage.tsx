import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  createProjectLead,
  getProject,
  type ProjectDetail,
} from "@/services/projects";
import { formatVnd, mediaUrl } from "@/utils/media";

export function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Tôi muốn được tư vấn dự án này.");
  const [busy, setBusy] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const p = await getProject(slug);
        if (alive) setProject(p);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Lỗi tải dự án");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const minPrice = useMemo(() => {
    if (!project?.unitTypes.length) return null;
    const nums = project.unitTypes
      .map((u) => (u.priceFrom ? Number(u.priceFrom) : NaN))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!nums.length) return null;
    return formatVnd(Math.min(...nums));
  }, [project]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!project) return;
    setBusy(true);
    setFormErr(null);
    setOkMsg(null);
    try {
      await createProjectLead({
        name: name.trim(),
        phone: phone.trim(),
        projectId: project.id,
        message: message.trim() || undefined,
      });
      setOkMsg("Đã gửi yêu cầu tư vấn. House X sẽ liên hệ sớm.");
      setMessage("");
    } catch (ex) {
      setFormErr(ex instanceof Error ? ex.message : "Gửi thất bại");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="muted">Đang tải…</p>;
  if (err || !project) {
    return (
      <div>
        <p className="err">{err ?? "Không tìm thấy dự án"}</p>
        <Link to="/" className="btn secondary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const img = mediaUrl(project.heroImageUrl);
  const loc = [project.district, project.province].filter(Boolean).join(", ");

  return (
    <div>
      <Link to="/" className="muted">
        ← Dự án
      </Link>
      <div
        className="detail-hero"
        style={img ? { backgroundImage: `url(${img})` } : undefined}
      />
      <h1 className="brand" style={{ fontSize: 22 }}>
        {project.name}
      </h1>
      {loc ? <p className="muted">{loc}</p> : null}
      {minPrice ? <p className="price">Từ {minPrice}</p> : null}
      {project.developerName ? (
        <p className="muted">CĐT: {project.developerName}</p>
      ) : null}
      {project.overviewText ? (
        <p className="lead">{project.overviewText}</p>
      ) : null}

      {project.unitTypes.length > 0 ? (
        <div className="card">
          <h2>Loại căn</h2>
          <ul className="unit-list">
            {project.unitTypes.map((u) => (
              <li key={u.id}>
                <strong>{u.name}</strong>
                <span>
                  {[
                    u.bedrooms != null ? `${u.bedrooms} PN` : null,
                    u.areaMin != null ? `${u.areaMin} m²` : null,
                    formatVnd(u.priceFrom),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className="card" onSubmit={onSubmit}>
        <h2>Nhận tư vấn</h2>
        <p className="muted" style={{ marginBottom: 10 }}>
          Không cam kết duyệt vay — chuyên viên House X sẽ tư vấn theo hồ sơ thật.
        </p>
        <input
          className="input"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
          required
        />
        <textarea
          className="input textarea"
          placeholder="Nội dung"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        {formErr ? <p className="err">{formErr}</p> : null}
        {okMsg ? <p className="ok">{okMsg}</p> : null}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Đang gửi…" : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
