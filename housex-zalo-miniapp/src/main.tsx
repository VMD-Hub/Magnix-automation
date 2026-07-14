import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles.css";

const container = document.getElementById("app");
if (!container) {
  document.body.innerHTML =
    "<p style='padding:24px;font-family:sans-serif'>Thiếu #app — cấu hình Zalo Mini App sai.</p>";
} else {
  try {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    container.innerHTML = `<div style="padding:24px;font-family:sans-serif">
      <h1 style="font-size:18px">House X — lỗi khởi động</h1>
      <p style="color:#9b111e;font-size:13px">${msg}</p>
    </div>`;
    console.error("[HouseX MiniApp] boot", err);
  }
}
