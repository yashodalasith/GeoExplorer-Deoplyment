import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://geo-explorer-deoplyment-71wq.vercel.app",
      },
    },
  },
});
