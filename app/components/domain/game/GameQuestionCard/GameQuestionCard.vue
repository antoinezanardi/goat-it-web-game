<script lang="ts" setup>
import type { GameQuestionCardProps } from "@/components/domain/game/GameQuestionCard/game-question-card.types";

defineProps<GameQuestionCardProps>();
</script>

<template>
  <div data-testid="game-question">
    <p data-testid="game-question-statement">
      {{ question.content.statement }}
    </p>

    <p data-testid="game-question-answer">
      {{ question.content.answer }}
    </p>
  </div>
</template>