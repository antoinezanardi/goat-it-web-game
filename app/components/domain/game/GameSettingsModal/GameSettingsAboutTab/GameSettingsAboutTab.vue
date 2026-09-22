<script lang="ts" setup>
import { VersionButton } from "#components";

const { t } = useI18n();
</script>

<template>
  <div
    class="flex flex-col gap-4 items-center text-center"
    data-testid="game-settings-about-tab"
  >
    <img
      :alt="t('home.brand')"
      class="h-auto w-24"
      data-testid="game-settings-about-logo"
      src="/img/logo/logo-192.avif"
    >

    <div class="flex flex-col gap-1">
      <span
        class="font-semibold text-fg-primary text-lg"
        data-testid="game-settings-about-brand"
      >
        {{ t("home.brand") }}
      </span>

      <span
        class="text-fg-secondary text-sm"
        data-testid="game-settings-about-tagline"
      >
        {{ t("home.tagline") }}
      </span>
    </div>

    <VersionButton/>
  </div>
</template>