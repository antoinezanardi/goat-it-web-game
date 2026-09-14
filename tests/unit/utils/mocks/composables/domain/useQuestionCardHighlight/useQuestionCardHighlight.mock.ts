import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseQuestionCardHighlightReturn } from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.types";

type UseQuestionCardHighlightMock = ToMock<UseQuestionCardHighlightReturn>;

function createUseQuestionCardHighlightMock(): UseQuestionCardHighlightMock {
  return {
    animate: vi.fn<UseQuestionCardHighlightReturn["animate"]>().mockResolvedValue(),
    playSequence: vi.fn<UseQuestionCardHighlightReturn["playSequence"]>().mockResolvedValue(),
  };
}

export { createUseQuestionCardHighlightMock };

export type { UseQuestionCardHighlightMock };