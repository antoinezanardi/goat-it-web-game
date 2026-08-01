<script lang="ts" setup>
import { HOME_PAGE_TITLE_KEY } from "@/pages/index.constants";

const { t } = useI18n();

const homePageTitle = computed<string>(() => t(HOME_PAGE_TITLE_KEY));

const playButtonUi = {
  base: "px-10 py-3 text-lg",
  label: "uppercase tracking-widest",
} as const;

useHead(() => ({
  title: homePageTitle.value,
}));
</script>

<template>
  <div class="bg-app-bg flex flex-col gap-6 items-center justify-center min-h-screen">
    <img
      :alt="t('home.brand')"
      class="h-auto min-w-32 w-64"
      src="/img/logo/logo-512.avif"
    >

    <h1 class="font-bold text-4xl text-fg-primary">
      {{ t('home.brand') }}
    </h1>

    <UButton
      color="neutral"
      icon="i-lucide-play-circle"
      :label="t('home.playButton')"
      size="xl"
      to="/game"
      :ui="playButtonUi"
      variant="outline"
    />

    <VersionButton/>
  </div>
</template>