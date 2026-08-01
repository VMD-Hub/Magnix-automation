import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles.css";

class BootErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[HouseX MiniApp] render", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: 18 }}>House X — lỗi giao diện</h1>
          <p style={{ color: "#9b111e", fontSize: 13, wordBreak: "break-word" }}>
            {this.state.error.message}
          </p>
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
    </div>`;
    console.error("[HouseX MiniApp] boot", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
