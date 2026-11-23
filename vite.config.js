import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:3000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "")
  }
};

export default defineConfig({
  plugins: [vue()],
  base: "./",
  server: { port: 5173, strictPort: true, proxy: apiProxy },
  preview: { port: 4173, strictPort: true, proxy: apiProxy },
  build: {
    rolldownOptions: {
      input: Object.fromEntries(
        ["index", "catalog", "checkout", "detail", "collection"]
          .map((name) => [name, fileURLToPath(new URL(`./${name}.html`, import.meta.url))])
      )
    }
  }
});

