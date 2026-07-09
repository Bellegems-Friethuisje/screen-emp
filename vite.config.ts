import vike from "vike/plugin";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { vercel } from "vite-plugin-vercel/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vike(), tailwindcss(), vercel(), vue()],
});
