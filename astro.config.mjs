import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
// Deployed to GitHub Pages at https://rell2405.github.io/Janet-Birthday-Site/
export default defineConfig({
  site: "https://rell2405.github.io",
  base: "/Janet-Birthday-Site",
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
