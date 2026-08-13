<script lang="ts" setup>
import { version } from "~~/package.json";
import { GITHUB_REPO_URL, VERSION_BUTTON_UI } from "@/components/domain/home/VersionButton/version-button.constants";
</script>

<template>
  <div
    class="flex items-center"
    data-testid="github-version-button"
  >
    <UTooltip :text="$t('home.githubTooltip')">
      <UButton
        color="neutral"
        :href="GITHUB_REPO_URL"
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