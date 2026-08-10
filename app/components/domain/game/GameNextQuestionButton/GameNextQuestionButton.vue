<script lang="ts" setup>
import type { GameNextQuestionButtonEmits, GameNextQuestionButtonProps } from "@/components/domain/game/GameNextQuestionButton/game-next-question-button.types";
import { GAME_NEXT_QUESTION_BUTTON_UI } from "@/components/domain/game/GameNextQuestionButton/game-next-question-button.constants";

const props = defineProps<GameNextQuestionButtonProps>();
const emit = defineEmits<GameNextQuestionButtonEmits>();

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UButton
    class="font-semibold game-question-navigation-button--themed h-10 md:self-end md:w-auto rounded-lg text-fg-primary text-sm"
    color="neutral"
    data-testid="game-next-question-button"
    :disabled="props.disabled"
    :label="$t('game.nextQuestion')"
    :loading="props.loading"
    size="lg"
    trailing-icon="i-lucide-arrow-right"
    type="button"
    :ui="GAME_NEXT_QUESTION_BUTTON_UI"
    variant="outline"
    @click="onClick"
  />
</template>