type QuestionCardHighlightPlayable = {
  playHighlight: () => Promise<void>;
};

type UseQuestionCardHighlightReturn = {
  animate: (elements: HTMLElement[]) => Promise<void>;
  playSequence: (
    targets: (QuestionCardHighlightPlayable | undefined | null)[],
    options?: { gapMs?: number },
  ) => Promise<void>;
};

export type { QuestionCardHighlightPlayable, UseQuestionCardHighlightReturn };