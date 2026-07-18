<script lang="ts" setup>
import type { GameQuestionCardContextAccordionProps } from "./game-question-card-context-accordion.types";

defineProps<GameQuestionCardContextAccordionProps>();

const collapsibleUi = { content: "overflow-hidden" } as const;

const buttonUi = {
  base: "ring-0 bg-surface-secondary hover:bg-surface-secondary",
  leadingIcon: "text-[var(--game-theme-neon)]",
  trailingIcon: "text-[var(--game-theme-neon)] group-data-[state=open]:rotate-180 transition-transform duration-200",
} as const;
</script>

<template>
  <UCollapsible :ui="collapsibleUi">
    <UButton
      block
      class="bg-surface-secondary border border-border-subtle group justify-between min-h-10 rounded-lg"
      color="neutral"
      leading-icon="i-lucide-file-text"
      trailing-icon="i-lucide-chevron-down"
      :ui="buttonUi"
      variant="outline"
    >
      <span class="font-medium text-sm text-text-primary">
        {{ $t("questions.contextAccordionTitle") }}
      </span>
    </UButton>

    <template #content>
      <div class="bg-surface-secondary border border-border-subtle mt-1 p-4 rounded-lg">
        <p
          v-if="context"
          class="leading-[1.6] text-sm text-text-secondary"
        >
          {{ context }}
        </p>

        <ul
          v-if="trivia?.length"
          class="leading-[1.6] list-disc mt-2 ps-5 space-y-1 text-sm text-text-secondary"
        >
          <li
            v-for="(item, index) in trivia"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </template>
  </UCollapsible>
</template>