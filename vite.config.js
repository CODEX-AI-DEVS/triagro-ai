import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     hmr: {
//       overlay: false,
//     },
//   },
// });

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Ghana NLP Translation API Proxy - Fixed CORS
      "/api/ghana-nlp/translate": {
        target: "https://translation-api.ghananlp.org/v1",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/api\/ghana-nlp\/translate/, "/translate"),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Add required headers for Ghana NLP API
            proxyReq.setHeader(
              "Ocp-Apim-Subscription-Key",
              "f61d93ed885e46629af097304e12d297"
            );
            proxyReq.setHeader("Content-Type", "application/json");
            proxyReq.setHeader("Accept", "application/json");
            proxyReq.setHeader("User-Agent", "TriAgro-Translation-Client/1.0");
            proxyReq.setHeader("Origin", "https://translation.ghananlp.org");

            console.log("🌍 Ghana NLP API Request:", req.method, req.url);
            console.log("📝 Headers:", {
              "Content-Type": proxyReq.getHeader("Content-Type"),
              "Ocp-Apim-Subscription-Key": proxyReq.getHeader(
                "Ocp-Apim-Subscription-Key"
              )
                ? "Present"
                : "Missing",
            });
          });

          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "✅ Ghana NLP API Response:",
              proxyRes.statusCode,
              req.url
            );

            // Add CORS headers to response
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] =
              "GET, POST, PUT, DELETE, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] =
              "Content-Type, Authorization, Ocp-Apim-Subscription-Key";
          });

          proxy.on("error", (err, _req, _res) => {
            console.error("❌ Ghana NLP API Proxy Error:", err.message);
          });
        },
      },
      // Ghana NLP Text-to-Speech API (if needed)
      "/api/ghana-nlp/tts": {
        target: "https://translation-api.ghananlp.org/v1",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/ghana-nlp\/tts/, "/tts"),
        headers: {
          "Ocp-Apim-Subscription-Key": "f61d93ed885e46629af097304e12d297",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      // Legacy translation proxy (keeping for backward compatibility)
      "/api/translate": {
        target: "https://translation-api.ghananlp.org/v1",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/translate/, "/translate"),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader(
              "Ocp-Apim-Subscription-Key",
              "f61d93ed885e46629af097304e12d297"
            );
            proxyReq.setHeader("Content-Type", "application/json");
            console.log("📡 Legacy API Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] =
              "GET, POST, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] =
              "Content-Type, Ocp-Apim-Subscription-Key";
            console.log(
              "📡 Legacy API Response:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
