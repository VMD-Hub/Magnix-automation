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
    /**
     * Chỉ 1 HTML entry — multi-page (mock-agent) tạo shared chunk `styles-*.js`
     * mà app-config không load → Zalo trắng màn (import ./styles-….js fail).
     * Mock local: `npm run dev` → /mock-agent.html (không qua zmp deploy).
     */
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        entryFileNames: "assets/index-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/index-[hash].[ext]",
      },
    },
  },
});
