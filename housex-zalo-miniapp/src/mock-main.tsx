import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MockAgentPreview } from "@/mock/MockAgentPreview";
import "./styles.css";

/**
 * Entry riêng — không qua HashRouter / HomeGate → /start.
 * Mở: http://localhost:PORT/dev/mock-agent.html
 */
const container = document.getElementById("app");
if (!container) {
  document.body.innerHTML =
    "<p style='padding:24px;font-family:sans-serif'>Thiếu #app</p>";
} else {
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter>
        <MockAgentPreview />
      </BrowserRouter>
    </StrictMode>,
  );
}
