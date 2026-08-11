<script lang="ts" setup>
import type { Collections } from "@nuxt/content";

const { locale, t, defaultLocale } = useI18n();

definePageMeta({ layout: "docs" });

useSeoMeta({
  title: () => t("seo.rules.title"),
  description: () => t("seo.rules.description"),
  ogTitle: () => t("seo.rules.title"),
  ogDescription: () => t("seo.rules.description"),
});

const collection = computed(() => `content_${locale.value}` as keyof Collections);

// Acceptable as top-level await is the Nuxt-idiomatic pattern for resolving useAsyncData during page setup
// oxlint-disable-next-line node/no-top-level-await
const { data: page, status } = await useAsyncData(`rules-${locale.value}`, async() => {
  const content = await queryCollection(collection.value).path("/rules").first();
  if (!content && locale.value !== defaultLocale) {
    return queryCollection(`content_${defaultLocale}`).path("/rules").first();
  }
  return content;
}, { watch: [locale] });
</script>

<template>
  <div
    id="rules-page"
    class="bg-app-bg flex flex-col min-h-dvh overflow-hidden"
  >
    <LoadingSpinner v-if="status === 'pending'"/>

    <div v-else-if="status === 'error'">
      {{ t('errors.generic') }}
    </div>

    <ContentRenderer
      v-else-if="page"
      :value="page"
    />

    <div v-else>
      {{ t('errors.pageNotFound') }}
    </div>
  </div>
</template>