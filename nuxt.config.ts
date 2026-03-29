// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  runtimeConfig: {
    // サーバーサイドのみ（秘匿）
    appsyncUrl: process.env.APPSYNC_URL || "",
    appsyncApiKey: process.env.APPSYNC_API_KEY || "",
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
