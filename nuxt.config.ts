// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/hints",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "nuxt-og-image",
    "nuxt-schema-org",
    "nuxt-seo-utils",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@vite-pwa/nuxt",
    "v-gsap-nuxt",
  ],
  $test: {
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
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      htmlAttrs: { lang: process.env.NUXT_PUBLIC_DEFAULT_LOCALE, class: "dark" },
      titleTemplate: "%s",
    },
  },
  css: ["~/assets/css/main.css"],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: "Goat It",
    indexable: true,
  },
  ui: {
    colorMode: false,
    experimental: { componentDetection: true },
  },
  runtimeConfig: {
    goatItApi: {
      baseUrl: "",
      gameKey: "",
    },
  },
  ignore: [
    "configs/**/*.ts",
    "eslint.config.ts",
  ],
  routeRules: {
    "/": { prerender: true },
  },
  sourcemap: { client: "hidden" },
  experimental: {
    viteEnvironmentApi: true,
  },
  compatibilityDate: "2025-01-15",
  nitro: { imports: { dirs: ["shared/utils/helpers/*.helpers.ts"] } },
  vite: {
    optimizeDeps: {
      include: [
        "@goat-it/schemas/shared/constants",
        "@goat-it/schemas/question",
        "@goat-it/schemas/question-theme",
        "fuse.js",
        "radashi",
        "zod",
      ],
    },
  },
  typescript: {
    shim: true,
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        noImplicitReturns: true,
        noImplicitAny: true,
        allowImportingTsExtensions: true,
      },
      include: [
        "../tests/",
        "../eslint.config.ts",
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
    defaultLocale: process.env.NUXT_PUBLIC_DEFAULT_LOCALE,
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
        ],
      },
    ],
    strategy: "no_prefix",
    restructureDir: "app/i18n",
    // eslint-disable-next-line unicorn/expiring-todo-comments
    // TODO: Remove this when nuxt-i18n supports message bundling from the dev server
    experimental: { optimizeMessageBundling: process.env.NODE_ENV !== "development" },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  ogImage: {
    security: {
      secret: process.env.NUXT_OG_IMAGE_SECURITY_SECRET ?? "goat-it-og-image-dev-secret",
      strict: true,
    },
  },
  pinia: { storesDirs: ["stores/**"] },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Goat It",
      short_name: "Goat It",
      description: "Un jeu de quiz multijoueur — relevez des défis avec des questions thématiques",
      theme_color: "#18181b",
      background_color: "#18181b",
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
      navigateFallback: null,
    },
  },
  sitemap: {
    zeroRuntime: true,
    exclude: [
      "/index.constants",
      "/game.constants",
    ],
  },
});