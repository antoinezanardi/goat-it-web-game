<script lang="ts" setup>
import type { GameNextQuestionButtonEmits, GameNextQuestionButtonProps } from "@/components/domain/game/GameNextQuestionButton/game-next-question-button.types";

const props = defineProps<GameNextQuestionButtonProps>();
const emit = defineEmits<GameNextQuestionButtonEmits>();

const buttonClass = computed<string | undefined>(() => (props.disabled || props.loading ? undefined : "game-question-navigation-button--themed"));

const buttonUi = computed<Record<string, string | undefined>>(() => ({
  base: "ring-0 bg-surface-interactive",
  label: "text-fg-primary",
  trailingIcon: props.disabled || props.loading ? undefined : "text-(color:--game-theme-neon)",
}));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UButton
    class="font-semibold h-10 md:self-end md:w-auto rounded-lg text-fg-primary text-sm"
    :class="buttonClass"
    color="neutral"
    data-testid="game-next-question-button"
    :disabled="props.disabled"
    :label="$t('game.nextQuestion')"
    :loading="props.loading"
    size="lg"
    trailing-icon="i-lucide-arrow-right"
    type="button"
    :ui="buttonUi"
    variant="outline"
    @click="onClick"
  />
</template>