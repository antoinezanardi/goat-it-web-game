<script lang="ts" setup>
import { SITE_NAME } from "#shared/constants/site.constants.ts";

import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "@/app.constants";

const questionThemesStore = useQuestionThemesStore();
const { fetchAndStoreQuestionThemes } = questionThemesStore;
const { handleGoatItApiError } = useGoatItApiErrorToast();
const { locale, t } = useI18n();
const route = useRoute();
const isScriptlessRoute = Boolean(getRouteRules({ path: route.path }).noScripts);

async function fetchQuestionThemes(): Promise<void> {
  const result = await fetchAndStoreQuestionThemes();
  if (!result.ok && result.superseded !== true) {
    handleGoatItApiError(result.error, { title: t("questionThemes.cantFetch"), context: "question-themes" });
  }
}

if (!isScriptlessRoute) {
  await callOnce(fetchQuestionThemes);

  watch(locale, () => {
    void fetchQuestionThemes();
  });
}

useHead({
  link: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png" },
    { rel: "preload", href: "/fonts/Geist/geist-latin.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
  ],
  meta: [
    { name: "theme-color", content: "#09090b" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-title", content: SITE_NAME },
  ],
});

useSeoMeta({
  ogImageAlt: () => t("seo.imageAlt"),
  twitterImageAlt: () => t("seo.imageAlt"),
});

useSchemaOrg([
  defineOrganization({
    name: SITE_NAME,
    description: () => t("seo.home.description"),
    slogan: () => t("home.tagline"),
  }),
  defineWebSite({
    name: SITE_NAME,
    description: () => t("seo.home.description"),
  }),
  defineWebPage({
    inLanguage: () => locale.value,
    primaryImageOfPage: {
      "@type": "ImageObject",
      "url": "/og-image.png",
      "width": 1200,
      "height": 600,
    },
  }),
]);
</script>

<template>
  <UApp
    :toaster="APP_TOAST_CONFIG"
    :tooltip="APP_TOOLTIP_CONFIG"
  >
    <UMain>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </UMain>

    <OfflineStatusIndicator/>

    <ChangelogModal/>
  </UApp>
</template>