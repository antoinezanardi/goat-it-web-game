import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseQuestionCardHighlightMock } from "~~/tests/unit/utils/mocks/composables/domain/useQuestionCardHighlight/useQuestionCardHighlight.mock";
import type { UseQuestionCardHighlightMock } from "~~/tests/unit/utils/mocks/composables/domain/useQuestionCardHighlight/useQuestionCardHighlight.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const useQuestionCardHighlightMock: MockHolder<UseQuestionCardHighlightMock> = {
  instance: createUseQuestionCardHighlightMock(),
};

mockNuxtImport("useQuestionCardHighlight", () => (): UseQuestionCardHighlightMock => useQuestionCardHighlightMock.instance);

beforeEach(() => {
  useQuestionCardHighlightMock.instance = createUseQuestionCardHighlightMock();
});

export { useQuestionCardHighlightMock };