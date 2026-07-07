import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function stripModuleDirectivesPlugin(): Plugin {
  return {
    name: "strip-module-directives",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("node_modules")) return null;
      const stripped = code.replace(
        /^\s*["']use client["'];?\s*\n?/gm,
        ""
      );
      if (stripped === code) return null;
      return { code: stripped, map: null };
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    stripModuleDirectivesPlugin(),
    tanstackStart({
      server: {
        preset: "vercel",
      },
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
  ssr: {
    // scripts/build-vercel.mjs copies only dist/server into the Vercel
    // function — no node_modules — so the production SSR build must be
    // fully self-contained. Dev keeps a minimal list since forcing CJS
    // packages like React through Vite's dev SSR runner breaks them.
    noExternal: command === "build" ? true : ["h3-v2", "rou3", "srvx", "seroval"],
  },
  server: {
    port: 8080,
    strictPort: true,
  },
}));
