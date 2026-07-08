import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth-context";
import { apiFetch } from "@/services/api";
import { listProjects } from "@/services/projects";

/**
 * Form tư vấn nhanh — cần chọn dự án (lead API bắt buộc projectId hoặc listingId).
 */
export function ConsultPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Tôi muốn được tư vấn NOXH.");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    void listProjects({ pageSize: 30 }).then((d) => {
      setProjects(d.items.map((p) => ({ id: p.id, name: p.name })));
      if (d.items[0]) setProjectId(d.items[0].id);
    });
  }, []);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setOk(null);
    try {
      const idem =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `consult-${Date.now()}`;
      await apiFetch("/api/leads", {
        method: "POST",
        headers: { "Idempotency-Key": idem },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          projectId,
          message: message.trim(),
          source: "zalo_miniapp",
        }),
      });
      setOk("Đã gửi. Chúng tôi sẽ liên hệ sớm.");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Gửi thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Link to="/" className="muted">
        ← Trang chủ
      </Link>
      <h1 className="brand" style={{ fontSize: 22 }}>
        Tư vấn nhanh
      </h1>
      <p className="lead">
        Điền SĐT để chuyên viên House X gọi lại. Không hứa duyệt vay.
      </p>
      <form className="card" onSubmit={onSubmit}>
        <label className="muted">Dự án quan tâm</label>
        <select
          className="input"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        {err ? <p className="err">{err}</p> : null}
        {ok ? <p className="ok">{ok}</p> : null}
        <button className="btn" type="submit" disabled={busy || !projectId}>
          {busy ? "Đang gửi…" : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
