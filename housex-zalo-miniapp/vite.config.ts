import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
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
    /** Một bundle cố định — sync-app-config.mjs cập nhật app-config.json */
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/index.[ext]",
      },
    },
  },
});
