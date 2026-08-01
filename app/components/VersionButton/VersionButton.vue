<script lang="ts" setup>
import { GITHUB_REPO_URL } from "@/components/VersionButton/version-button.constants";

const props = defineProps<{
  /** The application version displayed in the GitHub link label. */
  version: string;
}>();

const versionLabel = computed(() => `v${props.version}`);

const versionButtonClass = [
  "bg-(--ui-bg-elevated) gap-1.5 hover:bg-(--ui-bg-elevated-hover) hover:text-(--ui-text)",
  "inline-flex items-center px-3 py-1.5 ring-(--ui-border) ring-1 rounded-full shadow-sm",
  "text-(--ui-text-muted) text-xs transition-colors",
].join(" ");
</script>

<template>
  <div
    class="bottom-4 fixed right-4 z-50"
    data-testid="github-version-button"
  >
    <UTooltip :text="$t('home.githubTooltip')">
      <ULink
        :class="versionButtonClass"
        :href="GITHUB_REPO_URL"
        rel="noopener noreferrer"
        target="_blank"
      >
        <UIcon
          class="size-3.5"
          name="i-lucide-github"
        />

        <span>{{ versionLabel }}</span>
      </ULink>
    </UTooltip>
  </div>
</template>