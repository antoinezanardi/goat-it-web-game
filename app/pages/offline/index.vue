<script lang="ts" setup>
const { t } = useI18n();
</script>

<template>
  <div
    id="offline-page"
    class="bg-app-bg flex flex-col gap-6 items-center justify-center min-h-dvh px-6 text-center"
    data-testid="offline-page"
  >
    <UIcon
      aria-hidden="true"
      class="size-16 text-fg-secondary"
      name="i-lucide-wifi-off"
    />

    <h1
      class="font-bold text-3xl text-fg-primary"
      data-testid="offline-page-title"
    >
      {{ t("offline.title") }}
    </h1>

    <p
      class="max-w-md text-fg-secondary"
      data-testid="offline-page-description"
    >
      {{ t("offline.description") }}
    </p>

    <a
      class="bg-primary-800 border border-primary-300/45 font-medium px-5 py-2 rounded-lg shadow-[0_0_10px_rgba(30,64,175,0.45)] text-sm text-white"
      data-testid="offline-retry-link"
      href=""
    >
      {{ t("offline.retry") }}
    </a>
  </div>
</template>