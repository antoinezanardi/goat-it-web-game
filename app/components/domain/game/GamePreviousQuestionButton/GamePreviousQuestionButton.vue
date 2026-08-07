<script lang="ts" setup>
import type { GamePreviousQuestionButtonEmits, GamePreviousQuestionButtonProps } from "@/components/domain/game/GamePreviousQuestionButton/game-previous-question-button.types";

const props = defineProps<GamePreviousQuestionButtonProps>();
const emit = defineEmits<GamePreviousQuestionButtonEmits>();
const { t } = useI18n();

const buttonClass = computed<string | undefined>(() => (props.disabled ? undefined : "game-question-navigation-button--themed"));

const ariaLabel = computed<string>(() => t("game.previousQuestionTooltip"));

const buttonUi = computed<Record<string, string | undefined>>(() => ({
  base: "ring-0 bg-surface-interactive",
}));

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
      :ui="buttonUi"
      variant="outline"
      @click="onClick"
    />
  </UTooltip>
</template>