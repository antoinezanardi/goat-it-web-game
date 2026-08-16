<script lang="ts" setup>
import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "~/app.constants";

const questionThemesStore = useQuestionThemesStore();
const { fetchAndStoreQuestionThemes } = questionThemesStore;

void callOnce(fetchAndStoreQuestionThemes);

defineOgImage("Image.takumi");

useHead({
  link: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png" },
    { rel: "preload", href: "/fonts/Geist/geist-latin.woff2", as: "font", type: "font/woff2", crossorigin: "" },
  ],
  meta: [
    { name: "theme-color", content: "#09090b" },
    { name: "mobile-web-app-capable", content: "yes" },
  ],
});
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
  </UApp>
</template>