import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles.css";

class BootErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null; stack: string }
> {
  state: { error: Error | null; stack: string } = { error: null, stack: "" };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const stack = `${info.componentStack ?? ""}`.trim().slice(0, 400);
    this.setState({ stack });
    console.error("[HouseX MiniApp] render", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      const msg =
        this.state.error.message ||
        String(this.state.error) ||
        "Unknown render error";
      return (
        <div style={{ padding: 24, fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: 18, margin: "0 0 8px" }}>
            House X — lỗi giao diện
          </h1>
          <p
            style={{
              color: "#9b111e",
              fontSize: 13,
              wordBreak: "break-word",
              margin: "0 0 12px",
            }}
          >
            {msg}
          </p>
          {this.state.stack ? (
            <pre
              style={{
                fontSize: 11,
                color: "#5c5c5c",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#f5f5f7",
                padding: 10,
                borderRadius: 8,
                margin: "0 0 12px",
              }}
            >
              {this.state.stack}
            </pre>
          ) : null}
          <button
            type="button"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#9b111e",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ensureAppRoot(): HTMLElement {
  let el = document.getElementById("app");
  if (!el) {
    el = document.createElement("div");
    el.id = "app";
    (document.body || document.documentElement).appendChild(el);
  }
  return el;
}

function mount() {
  const container = ensureAppRoot();
  try {
    createRoot(container).render(
      <StrictMode>
        <BootErrorBoundary>
          <App />
        </BootErrorBoundary>
      </StrictMode>,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    container.innerHTML = `<div style="padding:24px;font-family:sans-serif">
      <h1 style="font-size:18px">House X — lỗi khởi động</h1>
      <p style="color:#9b111e;font-size:13px;word-break:break-word">${msg.replace(/</g, "&lt;")}</p>
      <p style="margin-top:12px"><button type="button" onclick="location.reload()" style="padding:10px 14px;border-radius:10px;border:0;background:#9b111e;color:#fff;font-weight:700">Thử lại</button></p>
    </div>`;
    console.error("[HouseX MiniApp] boot", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
