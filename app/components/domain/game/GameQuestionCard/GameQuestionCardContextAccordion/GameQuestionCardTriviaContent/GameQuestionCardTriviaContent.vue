<script lang="ts" setup>
import type { GameQuestionCardTriviaContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/GameQuestionCardTriviaContent/game-question-card-trivia-content.types";

const props = defineProps<GameQuestionCardTriviaContentProps>();
const { t } = useI18n();
</script>

<template>
  <section data-testid="game-question-trivia-content">
    <p
      class="flex font-semibold gap-1.5 items-center mb-1.5 text-(color:--game-theme-neon) text-sm"
      data-testid="game-question-trivia-title"
    >
      <UIcon
        class="size-4"
        name="i-lucide-sparkles"
      />
      {{ t("questions.triviaTitle") }}
    </p>

    <ul
      class="leading-body list-disc ps-5 space-y-1 text-fg-primary text-sm"
      data-testid="game-question-trivia"
    >
      <li
        v-for="(item, index) in props.trivia"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>
  </section>
</template>