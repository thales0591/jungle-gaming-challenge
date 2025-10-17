import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true, routesDirectory: "./src/pages" }),
    viteReact(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  // },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
