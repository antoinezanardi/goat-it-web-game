<script lang="ts" setup>
import type { GameQuestionCardContextAccordionProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/game-question-card-context-accordion.types";
import { GAME_QUESTION_CARD_CONTEXT_ACCORDION_BUTTON_UI, GAME_QUESTION_CARD_CONTEXT_ACCORDION_COLLAPSIBLE_UI } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/game-question-card-context-accordion.constants";

defineProps<GameQuestionCardContextAccordionProps>();
</script>

<template>
  <UCollapsible :ui="GAME_QUESTION_CARD_CONTEXT_ACCORDION_COLLAPSIBLE_UI">
    <UButton
      block
      class="bg-content border border-(color:--game-theme-border) game-question-accordion--themed group justify-between min-h-10 rounded-lg"
      color="neutral"
      data-testid="game-question-context-accordion-trigger"
      leading-icon="i-lucide-file-text"
      trailing-icon="i-lucide-chevron-down"
      :ui="GAME_QUESTION_CARD_CONTEXT_ACCORDION_BUTTON_UI"
      variant="outline"
    >
      <span class="font-medium text-fg-primary text-sm">
        {{ $t("questions.contextAccordionTitle") }}
      </span>
    </UButton>

    <template #content>
      <div class="bg-content border border-(color:--game-theme-border) game-question-accordion--themed mt-1 p-4 rounded-lg">
        <p
          v-if="context"
          class="leading-body text-fg-primary text-sm"
          data-testid="game-question-context"
        >
          {{ context }}
        </p>

        <ul
          v-if="trivia?.length"
          class="leading-body list-disc mt-2 ps-5 space-y-1 text-fg-primary text-sm"
          data-testid="game-question-trivia"
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