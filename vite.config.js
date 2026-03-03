import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Mungero",
        short_name: "Mungero",
        description: "Gestão de injeções, dosagem e progresso corporal.",
        theme_color: "#6C5CE7",
        background_color: "#F5F6FA",
        display: "standalone",
        start_url: "/",
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

  server: {
    host: true,
    port: 5173,

    // AQUI ESTÁ A CORREÇÃO DO NGROK
    allowedHosts: [
      ".ngrok-free.dev",
      "qualitatively-apothematical-joe.ngrok-free.dev"
    ]
  }
});