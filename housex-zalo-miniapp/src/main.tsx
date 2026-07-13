import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles.css";

const container = document.getElementById("app");
if (!container) {
  throw new Error("Zalo Mini App mount point #app not found");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
