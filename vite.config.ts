import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
        headers: {
          Origin: "http://localhost:8082",
        },
      },
    },
  },
});
