import { Component, type ErrorInfo, type ReactNode } from "react";
import { StrictMode } from "react";
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
    console.error("[HouseX MiniApp]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: 18 }}>House X — lỗi khởi động</h1>
          <p style={{ color: "#9b111e", fontSize: 13 }}>
            {this.state.error.message}
          </p>
          <p style={{ fontSize: 12, color: "#666" }}>
            Đóng Mini App và mở lại bằng QR Testing mới. Nếu vẫn lỗi, báo admin.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById("app");
if (!container) {
  throw new Error("Zalo Mini App mount point #app not found");
}

createRoot(container).render(
  <StrictMode>
    <BootErrorBoundary>
      <App />
    </BootErrorBoundary>
  </StrictMode>,
);
