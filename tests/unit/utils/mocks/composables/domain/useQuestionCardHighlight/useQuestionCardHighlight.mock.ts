import { vi } from "vitest";

import type {
  QuestionCardHighlightPlayable,
  UseQuestionCardHighlightReturn,
} from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.types";

type UseQuestionCardHighlightMock = UseQuestionCardHighlightReturn;

function createUseQuestionCardHighlightMock(): UseQuestionCardHighlightMock {
  return {
    animate: vi.fn<(elements: HTMLElement[]) => Promise<void>>().mockResolvedValue(),
    playSequence: vi.fn<
      (
        targets: (QuestionCardHighlightPlayable | undefined | null)[],
        options?: { gapMs?: number },
      ) => Promise<void>
    >().mockResolvedValue(),
  };
}

export { createUseQuestionCardHighlightMock };

export type { UseQuestionCardHighlightMock };