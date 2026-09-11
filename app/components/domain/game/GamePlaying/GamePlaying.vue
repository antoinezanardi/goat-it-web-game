<script lang="ts" setup>
import { CARD_TRANSITION_SAFETY_TIMEOUT_MS } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.constants";
import type { GameQuestionCardSwitcherDirection } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";
import type { GamePlayingEmits, GamePlayingProps } from "@/components/domain/game/GamePlaying/game-playing.types";

const props = defineProps<GamePlayingProps>();
const emit = defineEmits<GamePlayingEmits>();

const transitionDirection = ref<GameQuestionCardSwitcherDirection>("forward");
const isTransitioning = ref(false);
const pendingDirection = ref<GameQuestionCardSwitcherDirection | undefined>(undefined);
// Acceptable as the timeout handle is only assigned inside startSafetyTimeout before it is ever read
// oxlint-disable-next-line typescript/init-declarations
let safetyTimeout: ReturnType<typeof setTimeout> | undefined;

function startSafetyTimeout(): void {
  safetyTimeout = setTimeout(() => {
    isTransitioning.value = false;
    pendingDirection.value = undefined;
    finishTransition();
  }, CARD_TRANSITION_SAFETY_TIMEOUT_MS);
}

function onTransitionComplete(): void {
  clearTimeout(safetyTimeout);
  finishTransition();
}

function finishTransition(): void {
  if (transitionDirection.value === "forward") {
    emit("advance");
  } else {
    emit("previous");
  }
}

function handleNext(): void {
  if (isTransitioning.value) {
    return;
  }

  const nextIndex = props.currentIndex + 1;
  const entering = props.questions[nextIndex];

  if (entering && entering.id !== props.currentQuestion.id) {
    transitionDirection.value = "forward";
    isTransitioning.value = true;
    pendingDirection.value = "forward";
    startSafetyTimeout();

    return;
  }

  emit("advance");
}

function handlePrevious(): void {
  if (isTransitioning.value || !props.canGoToPreviousQuestion) {
    return;
  }

  const previousIndex = props.currentIndex - 1;
  const entering = props.questions[previousIndex];

  if (entering && entering.id !== props.currentQuestion.id) {
    transitionDirection.value = "backward";
    isTransitioning.value = true;
    pendingDirection.value = "backward";
    startSafetyTimeout();

    return;
  }

  emit("previous");
}

function onStaged(): void {
  isTransitioning.value = false;
  pendingDirection.value = undefined;
}

onUnmounted(() => {
  clearTimeout(safetyTimeout);
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 items-center justify-center mt-14 py-4">
      <GameQuestionCardSwitcher
        class="w-full"
        :current-index="props.currentIndex"
        :pending-direction="pendingDirection"
        :questions="props.questions"
        @complete="onTransitionComplete"
        @staged="onStaged"
      />
    </div>

    <div class="bottom-0 flex gap-3 items-center justify-between max-w-3xl mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sticky w-full">
      <div class="h-10 shrink-0 w-10">
        <Transition name="fade">
          <span v-if="props.canGoToPreviousQuestion">
            <GamePreviousQuestionButton
              :disabled="isTransitioning"
              @click="handlePrevious"
            />
          </span>
        </Transition>
      </div>

      <GameNextQuestionButton
        class="md:flex-none md:self-end md:w-auto"
        :disabled="isTransitioning"
        @click="handleNext"
      />
    </div>
  </div>
</template>