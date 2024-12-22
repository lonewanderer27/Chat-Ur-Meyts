import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isCapacitor = mode === "cap";

  return {
    plugins: [
      react(),
      legacy(),
      VitePWA({
        registerType: null,   // Disable service worker registration
        manifest: {
          name: "Chat-Ur-Meyts",
          short_name: "Chat-Ur-Meyts",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/pwa-maskable-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/pwa-maskable-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          start_url: "/",
          display: "standalone",
          background_color: "#FFFFFF",
          theme_color: "#0080c9",
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 ** 2, // 5 MB
          runtimeCaching: !isCapacitor
            ? [
                // Match video files
                {
                  urlPattern: /\.(?:mp4|webm)$/, // Match video files by extension
                  handler: "CacheFirst",
                  options: {
                    cacheName: "video-cache",
                    expiration: {
                      maxEntries: 10, // Limit to 10 videos
                    },
                  },
                },
                // Other Static Assets
                {
                  urlPattern:
                    /\.(?:js|css|html|png|jpg|jpeg|svg|webp|gif|woff|woff2|ttf|eot|ico)$/,
                  handler: "StaleWhileRevalidate",
                  options: {
                    cacheName: "static-assets-cache",
                    expiration: {
                      maxEntries: 200,
                      maxAgeSeconds: 60 * 60 * 24 * 30,
                    },
                  },
                },
              ]
            : undefined, // Disable cache for native apps
        },
      }),
    ],
    esbuild: {
      pure:
        mode === "production"
          ? ["console.log", "console.info", "console.error"]
          : [],
    },
    assetsInclude: ["**/*.lottie"],
  };
});
