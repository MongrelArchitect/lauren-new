import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@contexts": "/src/contexts",
      "@customHooks": "/src/hooks",
      "@pages": "/src/pages",
      "@customTypes": "/src/types",
      "@util": "/src/util",
    },
  },
});
