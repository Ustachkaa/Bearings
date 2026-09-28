import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5180,
    proxy: {
      "/api": { target: "http://localhost:7300", changeOrigin: true },
    },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
