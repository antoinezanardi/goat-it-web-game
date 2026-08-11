<script lang="ts" setup>
import { HOME_HOW_TO_PLAY_BUTTON_UI, HOME_PAGE_PLAY_BUTTON_UI } from "@/pages/index.constants";

const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.home.title"),
  description: () => t("seo.home.description"),
  ogTitle: () => t("seo.home.title"),
  ogDescription: () => t("seo.home.description"),
});
</script>

<template>
  <div
    id="home-page"
    class="bg-app-bg flex flex-col gap-6 items-center justify-center min-h-dvh overflow-hidden"
  >
    <img
      id="home-logo"
      :alt="t('home.brand')"
      class="h-auto md:w-64 min-w-32 sm:w-60 w-52"
      src="/img/logo/logo-512.avif"
    >

    <div class="flex flex-col gap-4 items-center text-center">
      <h1
        id="home-brand"
        class="font-bold text-5xl text-fg-primary text-shadow-lg"
      >
        {{ t('home.brand') }}
      </h1>

      <h2
        id="home-tagline"
        class="font-semibold text-2xl text-fg-primary"
      >
        {{ t('home.tagline') }}
      </h2>

      <p
        id="home-subtitle"
        class="font-bold italic shadow-lg text-md text-violet-300"
      >
        {{ t('home.subtitle') }}
      </p>
    </div>

    <div
      id="home-play-button-container"
      class="mt-4"
    >
      <UButton
        id="home-play-button"
        :label="t('home.playButton')"
        size="xl"
        to="/game"
        :ui="HOME_PAGE_PLAY_BUTTON_UI"
      />
    </div>

    <VersionButton/>

    <UButton
      icon="i-lucide-help-circle"
      :label="t('home.howToPlay')"
      size="md"
      to="/rules"
      :ui="HOME_HOW_TO_PLAY_BUTTON_UI"
      variant="subtle"
    />
  </div>
</template>

<style scoped>
#home-page {
  background-image: url('/img/home-bg.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  box-shadow: inset 0 0 0 1000px rgb(0 0 0 / 0.4);
}

#home-brand, #home-tagline, #home-subtitle {
  text-shadow: 0 4px 6px rgba(0, 0, 0, .8);
}

#home-play-button-container {
  position: relative;
  z-index: 0;
  width: fit-content;
  padding: 5px;
  background: linear-gradient(90deg, #03a9f4, #f441a5);
  border-radius: 0.9em;
  transition: all 0.4s ease;
}

#home-play-button-container::before {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  border-radius: 0.9em;
  z-index: -1;
  background: linear-gradient(90deg, #03a9f4, #f441a5);
  filter: blur(0);
  transition: opacity 0.6s ease, filter 0.4s ease;
  opacity: 0;
}

#home-play-button-container:hover::before {
  filter: blur(0.8em);
  opacity: 1;
}
</style>