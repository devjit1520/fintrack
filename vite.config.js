import {
  defineConfig,
} from "vite";

import react, {
  reactCompilerPreset,
} from "@vitejs/plugin-react";

import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [
    react(),

    babel({
      presets: [
        reactCompilerPreset(),
      ],
    }),
  ],

  build: {
    target: "es2020",

    sourcemap: false,

    cssCodeSplit: true,

    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId =
            id.replaceAll(
              "\\",
              "/"
            );

          if (
            !moduleId.includes(
              "/node_modules/"
            )
          ) {
            return undefined;
          }

          if (
            /\/node_modules\/(react|react-dom|react-router|react-router-dom)\//.test(
              moduleId
            )
          ) {
            return "react-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/recharts/"
            ) ||
            moduleId.includes(
              "/node_modules/d3-"
            )
          ) {
            return "charts-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/framer-motion/"
            )
          ) {
            return "motion-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/@supabase/"
            )
          ) {
            return "supabase-vendor";
          }

          if (
            moduleId.includes(
              "/node_modules/lucide-react/"
            )
          ) {
            return "icons-vendor";
          }

          return undefined;
        },
      },
    },
  },
});