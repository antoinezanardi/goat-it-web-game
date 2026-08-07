<script lang="ts" setup>
import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "~/app.constants";

const questionThemesStore = useQuestionThemesStore();
const { fetchAndStoreQuestionThemes } = questionThemesStore;

void callOnce(fetchAndStoreQuestionThemes);

useHead({
  link: [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "apple-touch-icon", href: "/pwa/apple-touch-icon.png" },
  ],
  meta: [
    { name: "theme-color", content: "#18181b" },
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
      <NuxtPage/>
    </UMain>
  </UApp>
</template>