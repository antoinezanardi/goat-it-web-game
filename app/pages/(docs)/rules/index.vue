<script lang="ts" setup>
import type { Collections } from "@nuxt/content";

const { locale, t, defaultLocale } = useI18n();

useSeoMeta({
  title: () => t("seo.rules.title"),
  description: () => t("seo.rules.description"),
  ogTitle: () => t("seo.rules.title"),
  ogDescription: () => t("seo.rules.description"),
});

const collection = computed(() => `content_${locale.value}` as keyof Collections);

const { data, status, execute } = await useAsyncData(`rules-${locale.value}`, async() => {
  const page = await queryCollection(collection.value).path("/rules").first();

  if (!page && locale.value !== defaultLocale) {
    const fallbackPage = await queryCollection(`content_${defaultLocale}`).path("/rules").first();
    const fallbackSections = await queryCollectionSearchSections(`content_${defaultLocale}`, {
      minHeading: "h2",
      maxHeading: "h3",
    }).where("path", "=", "/rules");

    return [fallbackPage, fallbackSections] as [typeof fallbackPage, typeof fallbackSections];
  }

  const sections = await queryCollectionSearchSections(collection.value, {
    minHeading: "h2",
    maxHeading: "h3",
  }).where("path", "=", "/rules");

  return [page, sections] as [typeof page, typeof sections];
}, { watch: [locale] });

const page = computed(() => data.value?.[0]);
const sections = computed(() => data.value?.[1] ?? []);

function onRetry(): void {
  void execute();
}
</script>

<template>
  <div
    id="rules-page"
    class="bg-app-bg flex flex-col min-h-dvh"
  >
    <div
      v-if="status === 'pending'"
      class="flex flex-1 items-center justify-center"
    >
      <LoadingSpinner/>
    </div>

    <StatusScreen
      v-else-if="status === 'error'"
      key="rules-page-error"
      icon="i-lucide-triangle-alert"
      test-id="rules-page-error"
      :title="t('errors.generic')"
      variant="page"
    >
      <template #actions>
        <UButton
          data-testid="rules-page-retry"
          icon="i-lucide-refresh-cw"
          :label="t('common.retry')"
          size="xl"
          @click="onRetry"
        />
      </template>
    </StatusScreen>

    <DocsPageShell
      v-else-if="page"
      :sections="sections"
    >
      <ContentRenderer
        class="docs-prose"
        :value="page"
      />

      <div class="flex justify-center mt-8">
        <UButton
          data-testid="docs-start-game-button"
          icon="i-lucide-play"
          :label="$t('docs.startGame')"
          size="lg"
          to="/game"
        />
      </div>
    </DocsPageShell>

    <StatusScreen
      v-else
      key="rules-page-not-found"
      icon="i-lucide-file-question"
      test-id="rules-page-not-found"
      :title="t('errors.pageNotFound')"
      variant="page"
    >
      <template #actions>
        <UButton
          data-testid="rules-page-back-home"
          icon="i-lucide-house"
          :label="t('common.backToHome')"
          size="xl"
          to="/"
        />
      </template>
    </StatusScreen>
  </div>
</template>