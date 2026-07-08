import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectCardView } from "@/components/ProjectCardView";
import { listProjects, type ProjectCard } from "@/services/projects";

export function HomePage() {
  const [items, setItems] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await listProjects({
          projectType: "NHA_O_XA_HOI",
          status: "DANG_BAN",
          pageSize: 20,
        });
        let list = data.items;
        if (list.length === 0) {
          const fallback = await listProjects({ pageSize: 20 });
          list = fallback.items;
        }
        if (alive) setItems(list);
      } catch (e) {
        if (alive) {
          setErr(e instanceof Error ? e.message : "Không tải được dự án");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <p className="muted">HOUSE X</p>
      <h1 className="brand">House X</h1>
      <p className="lead">
        Tìm nhà ở xã hội trên Zalo — dữ liệu đồng bộ timnhaxahoi.com.
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2>Công cụ</h2>
        <p className="muted" style={{ marginBottom: 10 }}>
          Kiểm tra điều kiện / khả năng vay — mở trong Mini App.
        </p>
        <Link className="btn secondary" to="/cong-cu">
          Điều kiện NOXH & công cụ
        </Link>
      </div>

      <div className="section-head">
        <h2 className="section-title">Dự án nổi bật</h2>
        <Link to="/tu-van" className="muted">
          Tư vấn nhanh
        </Link>
      </div>

      {loading ? <p className="muted">Đang tải dự án…</p> : null}
      {err ? <p className="err">{err}</p> : null}
      {!loading && !err && items.length === 0 ? (
        <div className="card">
          <p>Chưa có dự án để hiển thị. Vui lòng thử lại sau.</p>
        </div>
      ) : null}

      {items.map((p) => (
        <ProjectCardView key={p.id} project={p} />
      ))}
    </div>
  );
}
