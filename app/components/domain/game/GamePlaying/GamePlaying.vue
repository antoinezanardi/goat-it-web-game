<script lang="ts" setup>
import { onKeyStroke } from "@vueuse/core";

import { isEditableKeyboardTarget } from "#shared/utils/helpers/element/element.dom.helpers";
import type { GameQuestionCardSwitcherDirection } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";
import type { GamePlayingEmits, GamePlayingProps } from "@/components/domain/game/GamePlaying/game-playing.types";

const props = defineProps<GamePlayingProps>();
const emit = defineEmits<GamePlayingEmits>();

const transitionDirection = ref<GameQuestionCardSwitcherDirection>("forward");
const isTransitioning = ref<boolean>(false);
const pendingDirection = ref<GameQuestionCardSwitcherDirection | undefined>(undefined);

function onTransitionComplete(): void {
  finishTransition();
}

function finishTransition(): void {
  if (transitionDirection.value === "forward") {
    emit("advance");

    return;
  }
  emit("previous");
}

function canNavigate(direction: GameQuestionCardSwitcherDirection): boolean {
  if (isTransitioning.value) {
    return false;
  }
  return direction === "forward" || props.canGoToPreviousQuestion;
}

function navigate(direction: GameQuestionCardSwitcherDirection): void {
  if (!canNavigate(direction)) {
    return;
  }

  const targetIndex = direction === "forward" ? props.currentIndex + 1 : props.currentIndex - 1;
  const entering = props.questions[targetIndex];

  if (entering && entering.id !== props.currentQuestion.id) {
    transitionDirection.value = direction;
    isTransitioning.value = true;
    pendingDirection.value = direction;

    return;
  }

  if (direction === "forward") {
    emit("advance");

    return;
  }
  emit("previous");
}

function handleNext(): void {
  navigate("forward");
}

function handlePrevious(): void {
  navigate("backward");
}

function onStaged(): void {
  isTransitioning.value = false;
  pendingDirection.value = undefined;
}

function onQuestionShortcut(event: KeyboardEvent, direction: GameQuestionCardSwitcherDirection): void {
  if (props.areShortcutsDisabled || event.repeat || isEditableKeyboardTarget(event.target)) {
    return;
  }
  if (!canNavigate(direction)) {
    return;
  }
  event.preventDefault();
  navigate(direction);
}

onKeyStroke("ArrowLeft", event => onQuestionShortcut(event, "backward"), { dedupe: true, passive: false });
onKeyStroke("ArrowRight", event => onQuestionShortcut(event, "forward"), { dedupe: true, passive: false });
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