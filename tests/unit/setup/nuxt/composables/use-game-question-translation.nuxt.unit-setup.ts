import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGameQuestionTranslationMock } from "~~/tests/unit/utils/mocks/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseGameQuestionTranslationMock } from "~~/tests/unit/utils/mocks/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation.mock";

const useGameQuestionTranslationMock: MockHolder<UseGameQuestionTranslationMock> = { instance: createUseGameQuestionTranslationMock() };

mockNuxtImport("useGameQuestionTranslation", () => (..._arguments: unknown[]) => useGameQuestionTranslationMock.instance);

beforeEach(() => {
  useGameQuestionTranslationMock.instance = createUseGameQuestionTranslationMock();
});

export { useGameQuestionTranslationMock };