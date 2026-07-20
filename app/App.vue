<script lang="ts" setup>
import { APP_TOAST_CONFIG, APP_TOOLTIP_CONFIG } from "~/app.constants";

const questionThemesStore = useQuestionThemesStore();
const { fetchAndStoreQuestionThemes } = questionThemesStore;

void callOnce(fetchAndStoreQuestionThemes);
</script>

<template>
  <UApp
    :toaster="APP_TOAST_CONFIG"
    :tooltip="APP_TOOLTIP_CONFIG"
  >
    <NuxtPage/>
  </UApp>
</template>