import { DEFAULT_LOCALE_FALLBACK } from "#shared/constants/locale.constants.ts";

const siteEnvironment = (process.env.NUXT_SITE_ENV ?? "").trim() || (process.env.NODE_ENV === "production" ? "production" : "development");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/hints",
    "@nuxt/content",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "nuxt-seo-utils",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@vite-pwa/nuxt",
    "v-gsap-nuxt",
  ],
  $production: {
    sourcemap: false,
  },
  $test: {
    runtimeConfig: { public: { defaultLocale: "en" } },
    buildDir: ".nuxt/test",
    nitro: { output: { dir: ".nuxt/test/output" } },
    i18n: { defaultLocale: "en" },
  },
  ssr: true,
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: [".vue"],
    },
  ],
  imports: {
    dirs: [
      "~/composables/**/use*.ts",
      "~/repositories/**/*.repository.ts",
    ],
  },
  devtools: { enabled: process.env.NODE_ENV === "development" },
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
    head: {
      htmlAttrs: { class: "dark" },
      titleTemplate: "%s",
    },
  },
  css: ["~/assets/css/main.css"],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: "Goat It",
    env: siteEnvironment,
  },
  content: {
    experimental: {
      sqliteConnector: "native",
    },
    build: {
      markdown: {
        highlight: false,
      },
    },
  },
  ui: {
    colorMode: false,
    experimental: { componentDetection: true },
    fonts: false,
  },
  runtimeConfig: {
    goatItApi: {
      baseUrl: "",
      gameKey: "",
    },
    rateLimit: {
      maximumRequests: 60,
      windowInMs: 60_000,
      trustProxy: false,
    },
    security: {
      cspMode: "enforce",
    },
    public: { defaultLocale: DEFAULT_LOCALE_FALLBACK },
  },
  ignore: [
    "configs/**/*.ts",
    "eslint.config.ts",
  ],
  routeRules: {
    "/": { appLayout: "default-layout" },
    "/game": { appLayout: "default-layout" },
    "/rules": { appLayout: "docs-layout" },
    "/fonts/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/_i18n/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/img/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/pwa/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  },
  experimental: {
    viteEnvironmentApi: true,
  },
  compatibilityDate: "2026-10-14",
  nitro: {
    ignore: ["api/**/handlers/**"],
    imports: { dirs: ["shared/utils/helpers/**/*.helpers.ts"] },
    compressPublicAssets: { gzip: true, brotli: true },
  },
  vite: {
    optimizeDeps: {
      include: [
        "@goat-it/schemas/shared/constants",
        "@goat-it/schemas/question",
        "@goat-it/schemas/question-theme",
        "radashi",
        "zod",
      ],
    },
  },
  typescript: {
    shim: true,
    strict: true,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        noImplicitReturns: true,
        noImplicitAny: true,
        allowImportingTsExtensions: true,
      },
      include: [
        "../tests/",
        "../eslint.config.ts",
        "../content.config.ts",
        "../configs/",
      ],
    },
  },
  eslint: {
    config: {
      typescript: { tsconfigPath: "./tsconfig.json" },
      stylistic: true,
    },
  },
  i18n: {
    defaultLocale: process.env.NUXT_PUBLIC_DEFAULT_LOCALE ?? DEFAULT_LOCALE_FALLBACK,
    locales: [
      {
        code: "fr",
        language: "fr-FR",
        name: "Français",
        files: [
          "fr/home.json",
          "fr/common.json",
          "fr/errors.json",
          "fr/question-themes.json",
          "fr/questions.json",
          "fr/game.json",
          "fr/seo.json",
          "fr/docs.json",
          "fr/changelog.json",
        ],
      },
      {
        code: "en",
        language: "en-US",
        name: "English",
        files: [
          "en/home.json",
          "en/common.json",
          "en/errors.json",
          "en/question-themes.json",
          "en/questions.json",
          "en/game.json",
          "en/seo.json",
          "en/docs.json",
          "en/changelog.json",
        ],
      },
      {
        code: "de",
        language: "de-DE",
        name: "Deutsch",
        files: [
          "de/home.json",
          "de/common.json",
          "de/errors.json",
          "de/question-themes.json",
          "de/questions.json",
          "de/game.json",
          "de/seo.json",
          "de/docs.json",
          "de/changelog.json",
        ],
      },
      {
        code: "es",
        language: "es-ES",
        name: "Español",
        files: [
          "es/home.json",
          "es/common.json",
          "es/errors.json",
          "es/question-themes.json",
          "es/questions.json",
          "es/game.json",
          "es/seo.json",
          "es/docs.json",
          "es/changelog.json",
        ],
      },
      {
        code: "it",
        language: "it-IT",
        name: "Italiano",
        files: [
          "it/home.json",
          "it/common.json",
          "it/errors.json",
          "it/question-themes.json",
          "it/questions.json",
          "it/game.json",
          "it/seo.json",
          "it/docs.json",
          "it/changelog.json",
        ],
      },
      {
        code: "pt",
        language: "pt-PT",
        name: "Português",
        files: [
          "pt/home.json",
          "pt/common.json",
          "pt/errors.json",
          "pt/question-themes.json",
          "pt/questions.json",
          "pt/game.json",
          "pt/seo.json",
          "pt/docs.json",
          "pt/changelog.json",
        ],
      },
    ],
    strategy: "no_prefix",
    restructureDir: "app/i18n",
    // eslint-disable-next-line unicorn/expiring-todo-comments
    // TODO: Remove this when nuxt-i18n supports message bundling from the dev server
    experimental: {
      optimizeMessageBundling: process.env.NODE_ENV !== "development",
      nitroContextDetection: true,
      prerenderMessages: true,
    },
    detectBrowserLanguage: false,
  },
  icon: {
    clientBundle: {
      scan: {
        globInclude: ["app/**/*.{vue,ts}"],
      },
    },
  },
  pinia: { storesDirs: ["stores/**"] },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Goat It – Le jeu où la réponse se devine",
      short_name: "Goat It",
      description: "Goat It est un jeu de déduction basé sur des faits insolites. Posez vos questions au Maître du Jeu, menez l'enquête et trouvez la réponse.",
      theme_color: "#09090b",
      background_color: "#09090b",
      display: "standalone",
      orientation: "any",
      scope: "/",
      start_url: "/",
      lang: "fr",
      icons: [
        { src: "/pwa/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/pwa/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        { src: "/pwa/pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      screenshots: [
        { src: "/pwa/screenshot-home.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
        { src: "/pwa/screenshot-game.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
      ],
      shortcuts: [
        {
          name: "Jouer",
          short_name: "Jouer",
          url: "/game",
          icons: [{ src: "/pwa/pwa-192x192.png", sizes: "192x192" }],
        },
      ],
      categories: ["games"],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,otf,avif}"],
      globIgnores: ["**/pwa/screenshot-*"],
      navigateFallback: null,
    },
  },
  seo: { validateAppHead: true },
  sitemap: {
    enabled: siteEnvironment === "production",
    zeroRuntime: true,
  },
});