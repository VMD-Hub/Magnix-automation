import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/auth-context";
import {
  getPartnerContract,
  requestPartnerContractOtp,
  signPartnerContract,
  type PartnerContractState,
} from "@/services/agent";

/** Mini — e-contract OTP + terms (+ canvas tuỳ chọn). */
export function AgentEcontractPage() {
  const { canAgent, loading: authLoading } = useAuth();
  const [state, setState] = useState<PartnerContractState | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    if (!canAgent) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const d = await getPartnerContract();
        if (alive) setState(d);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Lỗi tải");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [canAgent]);

  function pos(canvas: HTMLCanvasElement, e: React.PointerEvent) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    };
  }

  function canvasDataUrl(): string | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i]! > 0) return canvas.toDataURL("image/png");
    }
    return null;
  }

  async function onRequestOtp() {
    setBusy(true);
    setErr(null);
    try {
      const r = await requestPartnerContractOtp();
      setOtpSent(true);
      setMsg(`Đã gửi OTP tới ${r.emailMasked}`);
      const d = await getPartnerContract();
      setState(d);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Không gửi OTP");
    } finally {
      setBusy(false);
    }
  }

  async function onSign() {
    if (!accepted || otp.trim().length !== 6) return;
    setBusy(true);
    setErr(null);
    try {
      await signPartnerContract({
        otp: otp.trim(),
        accepted: true,
        signatureDataUrl: canvasDataUrl(),
      });
      setMsg("Đã ký e-contract.");
      const d = await getPartnerContract();
      setState(d);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Không ký được");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading) return <p className="muted">Đang tải…</p>;
  if (!canAgent) return <Navigate to="/tai-khoan" replace />;
  if (loading) return <p className="muted">Đang tải…</p>;

  if (state?.signed) {
    return (
      <div className="agent-subpage">
        <Link to="/agent" className="muted">
          ← Agent
        </Link>
        <h1 className="brand" style={{ fontSize: 22 }}>
          E-contract đã ký
        </h1>
        <p className="muted">
          {state.version}
          {state.signedAt
            ? ` · ${new Date(state.signedAt).toLocaleString("vi-VN")}`
            : ""}
        </p>
        <Link to="/agent/khai-bao" className="btn" style={{ marginTop: 12 }}>
          Khai báo deal
        </Link>
      </div>
    );
  }

  return (
    <div className="agent-subpage">
      <Link to="/agent" className="muted">
        ← Agent
      </Link>
      <h1 className="brand" style={{ fontSize: 22 }}>
        {state?.title ?? "E-contract"}
      </h1>
      <p className="muted" style={{ marginBottom: 8 }}>
        Phiên bản {state?.currentVersion} · {state?.status}
      </p>
      <div className="card" style={{ maxHeight: 220, overflow: "auto" }}>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, margin: 0 }}>
          {state?.termsText}
        </pre>
      </div>
      <label className="agent-field" style={{ marginTop: 12 }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />{" "}
        Đồng ý điều khoản
      </label>
      <button
        type="button"
        className="btn secondary"
        disabled={busy || !accepted}
        onClick={() => void onRequestOtp()}
      >
        {otpSent ? "Gửi lại OTP" : "Gửi OTP email"}
      </button>
      {otpSent ? (
        <label className="agent-field">
          <span>Mã OTP</span>
          <input
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
        </label>
      ) : null}
      <p className="muted" style={{ marginTop: 8 }}>
        Chữ ký tay (tuỳ chọn)
      </p>
      <canvas
        ref={canvasRef}
        width={320}
        height={120}
        style={{
          width: "100%",
          border: "1px dashed #cbd5e1",
          borderRadius: 8,
          touchAction: "none",
          background: "#fff",
        }}
        onPointerDown={(e) => {
          const c = canvasRef.current;
          if (!c) return;
          drawing.current = true;
          c.setPointerCapture(e.pointerId);
          const ctx = c.getContext("2d");
          if (!ctx) return;
          const p = pos(c, e);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const c = canvasRef.current;
          if (!c) return;
          const ctx = c.getContext("2d");
          if (!ctx) return;
          const p = pos(c, e);
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.strokeStyle = "#0f172a";
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
      <button
        type="button"
        className="btn"
        style={{ width: "100%", marginTop: 12 }}
        disabled={busy || !accepted || otp.trim().length !== 6}
        onClick={() => void onSign()}
      >
        {busy ? "Đang ký…" : "Ký e-contract"}
      </button>
      {msg ? <p className="ok">{msg}</p> : null}
      {err ? <p className="err">{err}</p> : null}
    </div>
  );
}
