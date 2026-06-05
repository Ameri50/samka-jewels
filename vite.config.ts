import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  // eslint-disable-next-line prettier/prettier
  plugins: [
    TanStackRouterVite(),
    react(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist",
  },
});
