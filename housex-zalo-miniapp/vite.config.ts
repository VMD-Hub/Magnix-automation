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
      output: {
        manualChunks: undefined,
        entryFileNames: "assets/index-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/index-[hash].[ext]",
      },
    },
  },
});
