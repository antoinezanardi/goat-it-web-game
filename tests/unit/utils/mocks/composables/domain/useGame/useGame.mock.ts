import { vi } from "vitest";
import { computed, ref } from "vue";
import type { Ref } from "vue";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseGame, GamePageState } from "~/composables/domain/useGame/useGame";
import type { Question } from "#shared/types/question.types";

type UseGameMock = ToMock<UseGame> & {
  gameStateRef: Ref<GamePageState>;
  questionsRef: Ref<Question[]>;
};

/**
 * Creates a mock implementation of the `useGame` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseGameMock(): UseGameMock {
  const questionsReference = ref<Question[]>([]);
  const currentIndex = ref<number>(0);
  const gameStateReference = ref<GamePageState>("loading");

  return {
    canGoToPreviousQuestion: computed(() => currentIndex.value > 0),
    currentIndex,
    currentQuestion: computed(() => questionsReference.value[currentIndex.value]),
    questions: questionsReference,
    advanceToNextQuestion: vi.fn<UseGame["advanceToNextQuestion"]>(),
    goToPreviousQuestion: vi.fn<UseGame["goToPreviousQuestion"]>(),
    initialize: vi.fn<UseGame["initialize"]>(),
    gameState: computed(() => gameStateReference.value),
    gameStateRef: gameStateReference,
    questionsRef: questionsReference,
  };
}

export type { UseGameMock };

export { createUseGameMock };