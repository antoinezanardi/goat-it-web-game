<script lang="ts" setup>
import { resolveOfflinePageCopy } from "@/utils/ui/offline/helpers/offline-page-copy/offline-page-copy.helpers";

const { public: runtimeConfig } = useRuntimeConfig();
const copy = resolveOfflinePageCopy(runtimeConfig.defaultLocale);
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
      {{ copy.title }}
    </h1>

    <p
      class="max-w-md text-fg-secondary"
      data-testid="offline-page-description"
    >
      {{ copy.description }}
    </p>

    <a
      class="bg-primary font-medium px-5 py-2 rounded-lg text-app-bg"
      data-testid="offline-retry-link"
      href=""
    >
      {{ copy.retry }}
    </a>
  </div>
</template>