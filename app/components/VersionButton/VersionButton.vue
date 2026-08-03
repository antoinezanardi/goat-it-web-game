<script lang="ts" setup>
import { version } from "~~/package.json";
import { GITHUB_REPO_URL, VERSION_BUTTON_UI } from "@/components/VersionButton/version-button.constants";
</script>

<template>
  <div
    class="bottom-4 fixed right-4 z-50"
    data-testid="github-version-button"
  >
    <UTooltip :text="$t('home.githubTooltip')">
      <UButton
        color="primary"
        :href="GITHUB_REPO_URL"
        icon="i-lucide-github"
        :label="`v${version}`"
        rel="noopener noreferrer"
        size="md"
        target="_blank"
        :ui="VERSION_BUTTON_UI"
        variant="subtle"
      />
    </UTooltip>
  </div>
</template>