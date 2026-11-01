<script lang="ts" setup>
import type { GameStateRendererEmits, GameStateRendererProps } from "@/components/domain/game/GameStateRenderer/game-state-renderer.types";

const props = defineProps<GameStateRendererProps>();
const emit = defineEmits<GameStateRendererEmits>();

function onAdvance(): void {
  emit("advance");
}

function onPrevious(): void {
  emit("previous");
}

function onRetry(): void {
  emit("retry");
}

function onResetFilters(): void {
  emit("resetFilters");
}
</script>

<template>
  <Transition
    mode="out-in"
    name="fade-slide-up"
  >
    <GameLoading
      v-if="props.isTranslating || props.gameState === 'loading'"
      :is-translating="props.isTranslating"
    />

    <GamePlaying
      v-else-if="props.gameState === 'playing' && props.currentQuestion"
      :are-shortcuts-disabled="props.areShortcutsDisabled"
      :can-go-to-previous-question="props.canGoToPreviousQuestion"
      :current-index="props.currentIndex"
      :current-question="props.currentQuestion"
      :questions="props.questions"
      @advance="onAdvance"
      @previous="onPrevious"
    />

    <GameFetchError
      v-else-if="props.gameState === 'error'"
      @retry="onRetry"
    />

    <GameEmptyFilters
      v-else-if="props.gameState === 'no-matching-filters-questions'"
      @reset-filters="onResetFilters"
    />

    <GameNoMoreQuestions v-else/>
  </Transition>
</template>