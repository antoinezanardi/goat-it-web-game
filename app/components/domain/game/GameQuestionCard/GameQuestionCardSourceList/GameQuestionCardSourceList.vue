<script lang="ts" setup>
import type { GameQuestionCardSourceListProps } from "./game-question-card-source-list.types";

import { getSourceDomain } from "~/composables/domain/question/helpers/question.helpers";

defineProps<GameQuestionCardSourceListProps>();

const linkClass = [
  "border-b",
  "border-border-subtle",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-[var(--game-theme-focus)]",
  "font-medium",
  "gap-1.5",
  "group",
  "hover:border-[var(--game-theme-neon)]",
  "hover:text-[var(--game-theme-neon)]",
  "inline-flex",
  "items-center",
  "pb-0.5",
  "text-text-secondary",
  "text-xs",
  "transition-colors",
].join(" ");
</script>

<template>
  <nav
    :aria-label="$t('questions.sourcesAriaLabel')"
    class="flex flex-wrap gap-x-3 gap-y-2"
  >
    <ULink
      v-for="url in sourceUrls"
      :key="url"
      :aria-label="`${getSourceDomain(url)} — ${$t('questions.sourceOpensInNewTab')}`"
      :class="linkClass"
      rel="noopener noreferrer"
      target="_blank"
      :to="url"
    >
      <UIcon
        class="size-3.5"
        name="i-lucide-external-link"
      />
      {{ getSourceDomain(url) }}
    </ULink>
  </nav>
</template>