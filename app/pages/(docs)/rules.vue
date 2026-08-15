<script lang="ts" setup>
import type { Collections } from "@nuxt/content";

const { locale, t, defaultLocale } = useI18n();

definePageMeta({ layout: "docs-layout" });

useSeoMeta({
  title: () => t("seo.rules.title"),
  description: () => t("seo.rules.description"),
  ogTitle: () => t("seo.rules.title"),
  ogDescription: () => t("seo.rules.description"),
});

const collection = computed(() => `content_${locale.value}` as keyof Collections);

const { data, status } = await useAsyncData(`rules-${locale.value}`, async() => {
  const page = await queryCollection(collection.value).path("/rules").first();
  const sections = await queryCollectionSearchSections(collection.value, {
    minHeading: "h2",
    maxHeading: "h3",
  }).where("path", "=", "/rules");
  if (!page && locale.value !== defaultLocale) {
    const fallbackPage = await queryCollection(`content_${defaultLocale}`).path("/rules").first();

    return [fallbackPage, sections] as [typeof fallbackPage, typeof sections];
  }
  return [page, sections] as [typeof page, typeof sections];
}, { watch: [locale] });

const page = computed(() => data.value?.[0]);
const sections = computed(() => data.value?.[1] ?? []);
</script>

<template>
  <div
    id="rules-page"
    class="bg-app-bg flex flex-col min-h-dvh"
  >
    <LoadingSpinner v-if="status === 'pending'"/>

    <div v-else-if="status === 'error'">
      {{ t('errors.generic') }}
    </div>

    <DocsPageShell
      v-else-if="page"
      :sections="sections"
    >
      <ContentRenderer
        class="docs-prose"
        :value="page"
      />
    </DocsPageShell>

    <div v-else>
      {{ t('errors.pageNotFound') }}
    </div>
  </div>
</template>