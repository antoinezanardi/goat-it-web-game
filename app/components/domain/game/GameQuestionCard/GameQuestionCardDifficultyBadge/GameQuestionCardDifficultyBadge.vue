<script lang="ts" setup>
import type { GameQuestionCardDifficultyBadgeProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardDifficultyBadge/game-question-card-difficulty-badge.types";
import { getDifficultyColor, getDifficultyIcon, getDifficultyRingClass } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameQuestionCardDifficultyBadgeProps>();

const { t } = useI18n();

const tooltipText = computed<string>(() => t(`questions.difficultyTooltip.${props.difficulty}`));
</script>

<template>
  <UTooltip :text="tooltipText">
    <UBadge
      :aria-label="tooltipText"
      class="ring-2 rounded-full"
      :class="getDifficultyRingClass(difficulty)"
      :color="getDifficultyColor(difficulty)"
      data-testid="game-question-difficulty"
      :icon="getDifficultyIcon(difficulty)"
      size="lg"
      square
      variant="subtle"
    />
  </UTooltip>
</template>