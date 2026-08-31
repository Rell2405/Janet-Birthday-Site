import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
// Deployed to GitHub Pages at the verified custom domain.
export default defineConfig({
  site: "https://www.janetsislandbloom.com",
  base: "/",
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
