<script lang="ts" setup>
const { t } = useI18n();

const { isUnread, open: openChangelog } = useChangelogState();

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
    class="bg-app-bg flex flex-col min-h-dvh overflow-hidden relative"
  >
    <div class="absolute flex gap-2 right-4 top-4">
      <ChangelogWhatsNewButton
        data-testid="home-changelog-button"
        :is-unread="isUnread"
        @open-changelog="openChangelog"
      />

      <VersionButton/>
    </div>

    <div class="flex flex-1 flex-col gap-6 items-center justify-center">
      <img
        id="home-logo"
        :alt="t('home.brand')"
        class="h-auto md:w-64 min-w-32 sm:w-60 w-52"
        fetchpriority="high"
        height="512"
        src="/img/logo/logo-512.avif"
        width="512"
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

      <HomePlayButton/>
    </div>

    <HomeFooter class="mt-auto"/>
  </div>
</template>

<style scoped>
#home-page {
  position: relative;
  isolation: isolate;
}

#home-page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url('/img/home-bg.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 0 1000px rgb(0 0 0 / 0.4);
}

#home-brand, #home-tagline, #home-subtitle {
  text-shadow: 0 4px 6px rgba(0, 0, 0, .8);
}
</style>