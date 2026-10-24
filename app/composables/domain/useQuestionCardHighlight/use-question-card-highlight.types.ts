type QuestionCardHighlightPlayable = {
  /** Resolves once this card's highlight has finished. */
  playHighlight: () => Promise<void>;
};

/**
 * Highlight animation contract returned by `useQuestionCardHighlight`.
 */
type UseQuestionCardHighlightReturn = {
  /** Runs one staggered timeline on all elements at once; no-op on an empty list. */
  animate: (elements: HTMLElement[]) => Promise<void>;
  /** Plays the targets one after another, skipping nullish entries and waiting `gapMs` between them. */
  playSequence: (
    targets: (QuestionCardHighlightPlayable | undefined | null)[],
    options?: {
      /** Delay between consecutive targets; no delay when omitted. */
      gapMs?: number;
    },
  ) => Promise<void>;
};

export type { QuestionCardHighlightPlayable, UseQuestionCardHighlightReturn };