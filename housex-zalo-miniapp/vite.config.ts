import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const hxBuildId = `hx${Date.now().toString(36).slice(-5)}`;

export default defineConfig({
  base: "./",
  plugins: [react()],
  define: {
    __HX_BUILD_ID__: JSON.stringify(hxBuildId),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  build: {
    outDir: "www",
    emptyOutDir: true,
    /** Zalo Mini App — tránh lỗi dynamic import trên iOS */
    modulePreload: { polyfill: false },
    /**
     * Hash trong tên file → tránh CDN/Zalo cache cứng `assets/index.js`.
     * `sync-app-config.mjs` ghi đúng path mới vào app-config.json sau mỗi build.
     */
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        mockAgent: path.resolve(__dirname, "mock-agent.html"),
      },
      output: {
        manualChunks: undefined,
        // Giữ tên index-* cho entry chính (app-config / Zalo CDN).
        entryFileNames: (chunk) =>
          chunk.name === "main"
            ? "assets/index-[hash].js"
            : "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/index-[hash].[ext]",
      },
    },
  },
});
