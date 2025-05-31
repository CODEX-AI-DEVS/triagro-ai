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
      "/api/translate": {
        target: "https://translation.ghananlp.org/translate",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/translate/, ""),
        headers: {
          "Ocp-Apim-Subscription-Key": "f61d93ed885e46629af097304e12d297",
        },
      },
      "/api/tts": {
        target: "https://translation-api.ghananlp.org/tts/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts/, ""),
        headers: {
          "Ocp-Apim-Subscription-Key": "f61d93ed885e46629af097304e12d297",
        },
      },
    },
  },
});
