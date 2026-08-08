<script lang="ts" setup>
import type { GamePreviousQuestionButtonEmits, GamePreviousQuestionButtonProps } from "@/components/domain/game/GamePreviousQuestionButton/game-previous-question-button.types";
import { GAME_PREVIOUS_QUESTION_BUTTON_UI } from "@/components/domain/game/GamePreviousQuestionButton/game-previous-question-button.constants";

const props = defineProps<GamePreviousQuestionButtonProps>();
const emit = defineEmits<GamePreviousQuestionButtonEmits>();
const { t } = useI18n();

const buttonClass = computed<string | undefined>(() => (props.disabled ? undefined : "game-question-navigation-button--themed"));

const ariaLabel = computed<string>(() => t("game.previousQuestionTooltip"));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UTooltip :text="ariaLabel">
    <UButton
      :aria-label="ariaLabel"
      class="h-10 rounded-full w-10"
      :class="buttonClass"
      color="neutral"
      data-testid="game-previous-question-button"
      :disabled="props.disabled"
      icon="i-lucide-arrow-left"
      size="lg"
      :ui="GAME_PREVIOUS_QUESTION_BUTTON_UI"
      variant="outline"
      @click="onClick"
    />
  </UTooltip>
</template>