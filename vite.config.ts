import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        preset: "netlify",
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      external: [
        /^@tanstack\/.*/,
        /^framer-motion(\/.*)?$/,
        /^@radix-ui\/.*/,
      ],
    },
  },
  ssr: {
    external: [
      /^@tanstack\/.*/,
      /^framer-motion(\/.*)?$/,
      /^@radix-ui\/.*/,
    ],
  },
});
