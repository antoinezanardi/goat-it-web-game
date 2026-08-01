<script lang="ts" setup>
import { version } from "~~/package.json";
import { HOME_PAGE_TITLE_KEY, PLAY_BUTTON_KEY } from "@/pages/index.constants";

const { t } = useI18n();

const homePageTitle = computed<string>(() => t(HOME_PAGE_TITLE_KEY));

const homePageBrand = "Goat It";

const playButtonUi = {
  label: "uppercase tracking-widest",
} as const;

useHead(() => ({
  title: homePageTitle.value,
}));
</script>

<template>
  <div class="flex flex-col gap-6 items-center justify-center min-h-screen">
    <img
      :alt="homePageBrand"
      class="h-auto min-w-32 w-64"
      src="/img/logo/logo-256.avif"
    >

    <h1 class="font-bold text-(--ui-text-highlighted) text-4xl">
      {{ homePageBrand }}
    </h1>

    <UButton
      class="home-play-button"
      icon="i-lucide-play-circle"
      :label="t(PLAY_BUTTON_KEY)"
      size="xl"
      to="/game"
      :ui="playButtonUi"
    />

    <VersionButton :version="version"/>
  </div>
</template>