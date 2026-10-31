<script lang="ts" setup>
import { SITE_GITHUB_URL } from "#shared/constants/site.constants.ts";

import { version } from "~~/package.json";
import { VERSION_BUTTON_UI } from "@/components/shared/core/VersionButton/version-button.constants";
</script>

<template>
  <div
    class="flex items-center"
    data-testid="github-version-button"
  >
    <UTooltip :text="$t('home.githubTooltip')">
      <UButton
        color="neutral"
        :href="SITE_GITHUB_URL"
        icon="i-lucide-github"
        :label="`v${version}`"
        rel="noopener noreferrer"
        size="md"
        target="_blank"
        :ui="VERSION_BUTTON_UI"
        variant="outline"
      />
    </UTooltip>
  </div>
</template>