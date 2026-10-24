/**
 * Translation-state contract returned by `useGameQuestionTranslation`.
 */
type UseGameQuestionTranslation = {
  /** Mirrors the store's by-ids fetch status so the loading spinner can say the questions are being translated. */
  isTranslating: ComputedRef<boolean>;
};

export type { UseGameQuestionTranslation };