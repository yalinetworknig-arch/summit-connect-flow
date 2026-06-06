import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Strips "use client" / "use server" directives from node_modules before
// Vite/esbuild tries to bundle them — prevents "Module level directives
// cause errors when bundled" build failures with React ecosystem packages.
function stripModuleDirectivesPlugin(): Plugin {
  return {
    name: "strip-module-directives",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("node_modules")) return null;
      const stripped = code.replace(
        /^\s*["'](use client|use server)["'];?\s*\n?/gm,
        ""
      );
      if (stripped === code) return null;
      return { code: stripped, map: null };
    },
  };
}

export default defineConfig({
  plugins: [
    stripModuleDirectivesPlugin(),
    tanstackStart({
      server: {
        preset: "netlify",
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  ssr: {
    external: true,
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
