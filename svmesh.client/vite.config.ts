import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router"],
          mui: ["@mui/material", "@mui/icons-material", "@mui/lab"],
          markdown: ["react-markdown", "rehype-raw", "rehype-sanitize"],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase limit to reduce warnings for now
  },
});
