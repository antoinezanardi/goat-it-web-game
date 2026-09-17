import { computed, ref } from "vue";
import type { Ref } from "vue";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseGameQuestionTranslation } from "~/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation";

type UseGameQuestionTranslationMock = ToMock<UseGameQuestionTranslation> & {
  isTranslatingRef: Ref<boolean>;
};

/**
 * Creates a mock implementation of the `useGameQuestionTranslation` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseGameQuestionTranslationMock(): UseGameQuestionTranslationMock {
  const isTranslatingReference = ref<boolean>(false);

  return {
    isTranslating: computed(() => isTranslatingReference.value),
    isTranslatingRef: isTranslatingReference,
  };
}

export type { UseGameQuestionTranslationMock };

export { createUseGameQuestionTranslationMock };