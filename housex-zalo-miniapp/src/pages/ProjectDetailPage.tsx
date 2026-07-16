import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  createProjectLead,
  getProject,
  type ProjectDetail,
} from "@/services/projects";
import { formatVnd, mediaUrl } from "@/utils/media";
import {
  isYoutubeShortsUrl,
  toYoutubeEmbedUrl,
  toYoutubeWatchUrl,
} from "@/utils/youtube";
import {
  getPreferredLane,
  segmentForLane,
  segmentFromProjectType,
} from "@/services/lane";

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
  const [showForm, setShowForm] = useState(false);

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
        segment:
          segmentFromProjectType(project.projectType) ??
          segmentForLane(getPreferredLane() ?? "noxh"),
      });
      setOkMsg("Đã gửi yêu cầu. Chuyên viên House X sẽ liên hệ sớm.");
      setMessage("");
      setShowForm(false);
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
  const landing = project.landing;
  const intro =
    landing?.heroSubtitle ||
    project.description ||
    project.overviewText;

  return (
    <div className="project-landing">
      <Link to="/" className="muted">
        ← Dự án
      </Link>

      <div
        className="landing-hero"
        style={img ? { backgroundImage: `url(${img})` } : undefined}
      >
        <div className="landing-hero-overlay">
          <span className="chip">
            {project.projectType === "THUONG_MAI" ? "CCTM" : "NOXH"}
          </span>
          <h1>{project.name}</h1>
          {loc ? <p>{loc}</p> : null}
        </div>
      </div>

      <div className="landing-intro card">
        {minPrice ? <p className="price">Giá từ {minPrice}</p> : null}
        {project.developerName ? (
          <p className="muted">Chủ đầu tư: {project.developerName}</p>
        ) : null}
        {intro ? <p className="lead landing-lead">{intro}</p> : null}
      </div>

      {landing?.introVideo ? (
        <div className="landing-block">
          <h2 className="section-title">
            {landing.introVideo.title || `Video review ${project.name}`}
          </h2>
          {landing.introVideo.caption ? (
            <p className="muted landing-video-caption">
              {landing.introVideo.caption}
            </p>
          ) : null}
          {(() => {
            const embed = toYoutubeEmbedUrl(landing.introVideo.url);
            const watch = toYoutubeWatchUrl(landing.introVideo.url);
            const shorts = isYoutubeShortsUrl(landing.introVideo.url);
            if (embed) {
              return (
                <>
                  <div
                    className={
                      shorts
                        ? "landing-video-frame landing-video-frame--shorts"
                        : "landing-video-frame"
                    }
                  >
                    <iframe
                      title={
                        landing.introVideo.title ||
                        `Video review ${project.name}`
                      }
                      src={embed}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  {watch ? (
                    <p className="landing-video-link">
                      <a href={watch} target="_blank" rel="noopener noreferrer">
                        Mở trên YouTube
                      </a>
                    </p>
                  ) : null}
                </>
              );
            }
            return (
              <div className="landing-video-frame">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  src={landing.introVideo.url}
                >
                  Trình duyệt không hỗ trợ video.
                </video>
              </div>
            );
          })()}
        </div>
      ) : null}

      {landing && landing.highlights.length > 0 ? (
        <div className="landing-block">
          <h2 className="section-title">Điểm nổi bật</h2>
          {landing.highlights.map((h) => (
            <div key={h.title} className="card landing-highlight">
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {project.unitTypes.length > 0 ? (
        <div className="landing-block">
          <h2 className="section-title">Loại căn & giá tham khảo</h2>
          <div className="card">
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
        </div>
      ) : null}

      {landing && landing.amenities.length > 0 ? (
        <div className="landing-block">
          <h2 className="section-title">Tiện ích</h2>
          <div className="amenity-row">
            {landing.amenities.map((a) => (
              <span key={a} className="amenity-chip">
                {a}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {landing && landing.gallery.length > 1 ? (
        <div className="landing-block">
          <h2 className="section-title">Hình ảnh</h2>
          <div className="gallery-scroll">
            {landing.gallery.map((g) => {
              const u = mediaUrl(g.url);
              return u ? (
                <div
                  key={g.url}
                  className="gallery-thumb"
                  style={{ backgroundImage: `url(${u})` }}
                  title={g.caption ?? undefined}
                />
              ) : null;
            })}
          </div>
        </div>
      ) : null}

      {landing?.locationNotes ? (
        <div className="landing-block card">
          <h2 className="section-title">Vị trí & kết nối</h2>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{landing.locationNotes}</p>
        </div>
      ) : null}

      {landing && landing.faqs.length > 0 ? (
        <div className="landing-block">
          <h2 className="section-title">Hỏi & đáp</h2>
          {landing.faqs.map((f) => (
            <details key={f.q} className="card faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      ) : null}

      <div className="landing-cta-spacer" />

      {showForm ? (
        <form className="card landing-form-panel" onSubmit={onSubmit}>
          <h2>{landing?.ctaLabel ?? "Để lại SĐT tư vấn"}</h2>
          <p className="muted" style={{ marginBottom: 10 }}>
            {landing?.ctaSubtext ??
              "Không cam kết duyệt vay — chuyên viên House X tư vấn theo hồ sơ thật."}
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
            placeholder="Nội dung (tuỳ chọn)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
          />
          {formErr ? <p className="err">{formErr}</p> : null}
          {okMsg ? <p className="ok">{okMsg}</p> : null}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}
          </button>
          <button
            type="button"
            className="btn secondary"
            style={{ marginTop: 8 }}
            onClick={() => setShowForm(false)}
          >
            Đóng
          </button>
        </form>
      ) : null}

      <div className="landing-sticky-cta">
        <button
          type="button"
          className="btn"
          onClick={() => setShowForm(true)}
        >
          {landing?.ctaLabel ?? "Liên hệ tư vấn ngay"}
        </button>
      </div>
    </div>
  );
}
