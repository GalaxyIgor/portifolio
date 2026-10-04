import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const workspace = fileURLToPath(new URL("../../../", import.meta.url));
export default defineConfig({
  root: fileURLToPath(new URL("./", import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      "@": `${workspace}src`,
      "next/image": fileURLToPath(new URL("./Image.tsx", import.meta.url)),
    },
  },
  server: { fs: { allow: [workspace] } },
});
