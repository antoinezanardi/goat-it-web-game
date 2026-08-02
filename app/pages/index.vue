<script lang="ts" setup>
import { HOME_PAGE_PLAY_BUTTON_UI, HOME_PAGE_TITLE_KEY } from "@/pages/index.constants";

const { t } = useI18n();

const homePageTitle = computed<string>(() => t(HOME_PAGE_TITLE_KEY));

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

    <h1 class="font-bold mb-10 text-5xl text-fg-primary">
      {{ t('home.brand') }}
    </h1>

    <UButton
      color="primary"
      :label="t('home.playButton')"
      size="xl"
      to="/game"
      :ui="HOME_PAGE_PLAY_BUTTON_UI"
      variant="solid"
    />

    <VersionButton/>
  </div>
</template>