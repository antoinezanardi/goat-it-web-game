<script lang="ts" setup>
import type { Question } from "#shared/types/question.types";

const props = defineProps<{
  /** Whether the user can navigate to the previous question. */
  canGoToPreviousQuestion: boolean;
  /** Index of the current question within the questions list. */
  currentIndex: number;
  /** The question currently displayed to the user. */
  currentQuestion: Question;
  /** The ordered list of questions available to the game. */
  questions: Question[];
}>();

const emit = defineEmits<{
  advance: [];
  previous: [];
}>();

const SAFETY_TIMEOUT_MS = 600;

const leavingQuestion = ref<Question | undefined>(undefined);
const enteringQuestion = ref<Question | undefined>(undefined);
const transitionDirection = ref<"forward" | "backward">("forward");
const isTransitioning = ref<boolean>(false);
// Acceptable as the timeout handle is only assigned inside startSafetyTimeout before it is ever read
// oxlint-disable-next-line typescript/init-declarations
let safetyTimeout: ReturnType<typeof setTimeout> | undefined;

function startSafetyTimeout(): void {
  safetyTimeout = setTimeout(() => {
    isTransitioning.value = false;
    if (leavingQuestion.value && enteringQuestion.value) {
      if (transitionDirection.value === "forward") {
        emit("advance");
      } else {
        emit("previous");
      }
      leavingQuestion.value = undefined;
    }
  }, SAFETY_TIMEOUT_MS);
}

function onTransitionComplete(): void {
  clearTimeout(safetyTimeout);
  if (transitionDirection.value === "forward") {
    emit("advance");
  } else {
    emit("previous");
  }
  leavingQuestion.value = undefined;
  isTransitioning.value = false;
}

function handleNext(): void {
  if (isTransitioning.value) {
    return;
  }

  const leaving = props.currentQuestion;
  const nextIndex = props.currentIndex + 1;
  const entering = props.questions[nextIndex];

  if (entering && entering.id !== leaving.id) {
    leavingQuestion.value = leaving;
    enteringQuestion.value = entering;
    transitionDirection.value = "forward";
    isTransitioning.value = true;

    startSafetyTimeout();

    return;
  }

  emit("advance");
}

function handlePrevious(): void {
  if (isTransitioning.value || !props.canGoToPreviousQuestion) {
    return;
  }

  const leaving = props.currentQuestion;
  const previousIndex = props.currentIndex - 1;
  const entering = props.questions[previousIndex];

  if (entering && entering.id !== leaving.id) {
    leavingQuestion.value = leaving;
    enteringQuestion.value = entering;
    transitionDirection.value = "backward";
    isTransitioning.value = true;

    startSafetyTimeout();

    return;
  }

  emit("previous");
}

onUnmounted(() => {
  clearTimeout(safetyTimeout);
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 items-center justify-center py-6">
      <GameQuestionCardTransition
        v-if="leavingQuestion && enteringQuestion"
        class="w-full"
        :direction="transitionDirection"
        :entering-question="enteringQuestion"
        :leaving-question="leavingQuestion"
        @complete="onTransitionComplete"
      />

      <GameQuestionCard
        v-else
        class="w-full"
        :question="props.currentQuestion"
      />
    </div>

    <div class="bottom-0 flex gap-3 items-center justify-between max-w-3xl mx-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sticky w-full">
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