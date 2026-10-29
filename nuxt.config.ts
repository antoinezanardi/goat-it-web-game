import { readFileSync } from "node:fs";
import path from "node:path";

import { DEFAULT_LOCALE_FALLBACK } from "#shared/constants/locale.constants.ts";
import { SITE_CONTACT_EMAIL, SITE_FOUNDING_DATE, SITE_GITHUB_URL, SITE_NAME } from "#shared/constants/site.constants.ts";
import { resolveDefaultLocale } from "#shared/utils/helpers/locale/locale.helpers.ts";
import { buildPwaManifest } from "#shared/utils/helpers/pwa/manifest/build-pwa-manifest.helpers.ts";
import { loadPwaManifestTranslations } from "#shared/utils/helpers/pwa/manifest/load-pwa-manifest-translations.helpers.ts";
import { resolveSiteEnvironment } from "#shared/utils/helpers/site/site-environment.helpers.ts";

const defaultLocale = resolveDefaultLocale(process.env.NUXT_PUBLIC_DEFAULT_LOCALE, DEFAULT_LOCALE_FALLBACK);
const localesDirectory = path.resolve(process.cwd(), "app/i18n/locales");

function readLocaleJson(fileName: string): unknown {
  return JSON.parse(readFileSync(path.resolve(localesDirectory, defaultLocale, fileName), "utf8"));
}

const pwaManifest = buildPwaManifest({
  locale: defaultLocale,
  translations: loadPwaManifestTranslations(readLocaleJson),
});
const siteEnvironment = resolveSiteEnvironment(process.env);

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
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
  },
  css: ["~/assets/css/main.css"],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: SITE_NAME,
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
    public: { defaultLocale },
  },
  ignore: [
    "configs/**/*.ts",
    "eslint.config.ts",
  ],
  routeRules: {
    "/": { appLayout: "default-layout" },
    "/game": { appLayout: "default-layout" },
    "/rules": { appLayout: "docs-layout" },
    "/offline": { prerender: true, noScripts: true, robots: false },
    "/fonts/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/_i18n/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/img/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    "/pwa/**": { headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viteEnvironmentApi: true,
  },
  compatibilityDate: "2026-10-14",
  nitro: {
    ignore: ["api/**/handlers/**", "routes/**/handlers/**"],
    imports: { dirs: ["shared/utils/helpers/**/*.helpers.ts"] },
    compressPublicAssets: { gzip: true, brotli: true },
  },
  vite: {
    optimizeDeps: {
      include: [
        "@goat-it/schemas/question",
        "@goat-it/schemas/question-theme",
        "@goat-it/schemas/shared/constants",
        "@goat-it/schemas/shared/locale",
        "gsap",
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
    defaultLocale,
    locales: [
      {
        code: "fr",
        language: "fr-FR",
        name: "Français",
        files: [
          "fr/home.json",
          "fr/common.json",
          "fr/offline.json",
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
          "en/offline.json",
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
          "de/offline.json",
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
          "es/offline.json",
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
          "it/offline.json",
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
          "pt/offline.json",
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
    manifest: pwaManifest,
    workbox: {
      globPatterns: ["offline/index.html", "_nuxt/entry.*.css", "fonts/**/*.{woff2,otf}"],
      globIgnores: ["**/offline/_payload.json"],
      maximumFileSizeToCacheInBytes: 512 * 1024,
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: ({ request, sameOrigin }): boolean => sameOrigin && request.mode === "navigate",
          handler: "NetworkOnly",
          options: {
            precacheFallback: { fallbackURL: "/offline" },
          },
        },
      ],
    },
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: SITE_NAME,
      email: SITE_CONTACT_EMAIL,
      foundingDate: SITE_FOUNDING_DATE,
      sameAs: [SITE_GITHUB_URL],
      logo: {
        "@type": "ImageObject",
        "url": "/pwa/pwa-512x512.png",
        "width": 512,
        "height": 512,
      },
    },
  },
  seo: { validateAppHead: true },
  sitemap: {
    enabled: siteEnvironment === "production",
    zeroRuntime: true,
  },
});