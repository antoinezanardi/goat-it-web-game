<script lang="ts" setup>
import { HOME_PAGE_PLAY_BUTTON_UI, HOME_PAGE_TITLE_KEY } from "@/pages/index.constants";

const { t } = useI18n();

const homePageTitle = computed<string>(() => t(HOME_PAGE_TITLE_KEY));

useHead(() => ({
  title: homePageTitle.value,
}));
</script>

<template>
  <div
    id="home-page"
    class="bg-app-bg flex flex-col gap-6 items-center justify-center min-h-screen"
  >
    <img
      :alt="t('home.brand')"
      class="h-auto min-w-32 w-64"
      src="/img/logo/logo-512.avif"
    >

    <h1 class="font-bold mb-10 text-5xl text-fg-primary text-shadow-lg">
      {{ t('home.brand') }}
    </h1>

    <div id="home-play-button-container">
      <UButton
        id="home-play-button"
        :label="t('home.playButton')"
        size="xl"
        to="/game"
        :ui="HOME_PAGE_PLAY_BUTTON_UI"
      />
    </div>

    <VersionButton/>
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

#home-play-button {
  text-shadow: 0 2px 6px rgba(0, 0, 0, .6);
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