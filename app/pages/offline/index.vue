<script lang="ts" setup>
const { t } = useI18n();

const OFFLINE_RETRY_LINK_CLASSES =
  "bg-primary-800 border border-primary-300/45 focus-visible:outline-3 focus-visible:outline-primary-300/50 " +
  "font-medium gap-2 hover:bg-primary-800/75 active:bg-primary-800/75 inline-flex items-center " +
  "px-3 py-2 rounded-md shadow-[0_0_10px_rgba(30,64,175,0.45)] text-base text-white " +
  "[text-shadow:0_1px_2px_rgba(0,0,0,0.5)] transition-colors";
</script>

<template>
  <StatusScreen
    id="offline-page"
    :description="t('offline.description')"
    icon="i-lucide-wifi-off"
    test-id="offline-page"
    :title="t('offline.title')"
    title-tag="h1"
    variant="page"
  >
    <template #actions>
      <a
        :class="OFFLINE_RETRY_LINK_CLASSES"
        data-testid="offline-retry-link"
        href=""
      >
        {{ t("offline.retry") }}
      </a>
    </template>
  </StatusScreen>
</template>