// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/hints",
    "@pinia/nuxt",
    "@nuxt/eslint",
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
      htmlAttrs: { lang: process.env.NUXT_PUBLIC_DEFAULT_LOCALE },
      title: "Goat It Game",
    },
  },
  css: ["~/assets/css/main.css"],
  ui: { experimental: { componentDetection: true } },
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
  sourcemap: { client: "hidden" },
  experimental: {
    serverAppConfig: false,
    viteEnvironmentApi: true,
  },
  compatibilityDate: "2025-01-15",
  nitro: { imports: { dirs: ["shared/utils/helpers/*.helpers.ts"] } },
  vite: {
    optimizeDeps: {
      include: [
        "fuse.js",
        "radashi",
        "zod",
        "@goat-it/schemas/question",
        "@goat-it/schemas/question-theme",
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
        ],
      },
    ],
    strategy: "no_prefix",
    restructureDir: "app/i18n",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  pinia: { storesDirs: ["stores/**"] },
});