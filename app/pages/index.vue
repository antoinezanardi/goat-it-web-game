<script lang="ts" setup>
import { HOME_PAGE_TITLE_KEY } from "@/pages/index.constants";

const { t } = useI18n();

const homePageTitle = computed<string>(() => t(HOME_PAGE_TITLE_KEY));

useHead(() => ({
  title: homePageTitle.value,
}));
</script>

<template>
  <div id="home-page">
    <h1 class="sr-only">
      {{ homePageTitle }}
    </h1>

    <NuxtLink to="/game">
      {{ $t("home.gameLink") }}
    </NuxtLink>
  </div>
</template>