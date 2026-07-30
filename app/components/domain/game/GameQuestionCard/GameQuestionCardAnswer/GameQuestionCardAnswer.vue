<script lang="ts" setup>
import type { GameQuestionCardAnswerProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardAnswer/game-question-card-answer.types";

const props = defineProps<GameQuestionCardAnswerProps>();
const { t } = useI18n();
</script>

<template>
  <section class="bg-content border border-(color:--game-theme-border) md:p-5 p-4 rounded-lg">
    <p
      class="flex font-semibold gap-1.5 items-center mb-2 text-(color:--game-theme-neon) text-base"
    >
      <UIcon
        class="size-5"
        name="i-lucide-lightbulb"
      />
      {{ t("questions.answerLabel") }}
    </p>

    <p
      class="font-medium leading-[1.5] md:text-xl text-lg text-text-answer"
      data-testid="game-question-answer"
    >
      {{ props.text }}
    </p>
  </section>
</template>