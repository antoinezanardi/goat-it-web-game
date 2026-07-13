<script lang="ts" setup>
import { HOME_PAGE_TITLE_KEY } from "@/pages/index.constants";

const { t } = useI18n();

useHead(() => ({
  title: t(HOME_PAGE_TITLE_KEY),
}));
</script>

<template>
  <main>
    <NuxtLink to="/game">
      {{ $t("home.gameLink") }}
    </NuxtLink>
  </main>
</template>