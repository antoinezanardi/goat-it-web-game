<script lang="ts" setup>
import type { GameQuestionCardDifficultyBadgeProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardDifficultyBadge/game-question-card-difficulty-badge.types";
import { getDifficultyColor, getDifficultyIcon, getDifficultyRingClass } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameQuestionCardDifficultyBadgeProps>();

const { t } = useI18n();

const tooltipText = computed<string>(() => t(`questions.difficultyTooltip.${props.difficulty}`));
const ringClass = computed<string>(() => getDifficultyRingClass(props.difficulty));
const difficultyColor = computed<"success" | "warning" | "error">(() => getDifficultyColor(props.difficulty));
const difficultyIcon = computed<string>(() => getDifficultyIcon(props.difficulty));
</script>

<template>
  <UTooltip :text="tooltipText">
    <UBadge
      :aria-label="tooltipText"
      class="p-2 ring-2 rounded-full"
      :class="ringClass"
      :color="difficultyColor"
      data-testid="game-question-difficulty"
      :icon="difficultyIcon"
      size="lg"
      square
      variant="subtle"
    />
  </UTooltip>
</template>