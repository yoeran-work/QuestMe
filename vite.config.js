import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "QuestMe",
        short_name: "QuestMe",
        description: "Turn real life into an RPG.",

        theme_color: "#080b14",
        background_color: "#080b14",

        display: "standalone",

        start_url: "/QuestMe/",
        scope: "/QuestMe/",
        id: "/QuestMe/",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],

  base: "/QuestMe/"
});
