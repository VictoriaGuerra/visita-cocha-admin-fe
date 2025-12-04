import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ["recharts"]
  },
  build: {
    rollupOptions: {
      // Si haces SSR y no quieres bundlear recharts en el server
      external: ["recharts"]
    }
  }
});
