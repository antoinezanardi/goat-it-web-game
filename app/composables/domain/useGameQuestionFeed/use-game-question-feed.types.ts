import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";

type UseGameQuestionFeedOptions = {
  /** Index of the displayed question; drives the prefetch threshold and the restart truncation. */
  currentIndex: Ref<number>;
};

/**
 * Question-buffer contract returned by `useGameQuestionFeed`.
 */
type UseGameQuestionFeed = {
  /** Store-owned buffer; append, truncate, or replace it only through store actions. */
  questions: Ref<Question[]>;
  /** True when the API has no questions left and no narrowing filter caused it. */
  isExhausted: Ref<boolean>;
  /** True when the last batch was empty because the active filters match no question. */
  hasNoMatchingFiltersQuestions: Ref<boolean>;
  /** True after a failed batch; the next successful fetch clears it. */
  hasFetchError: Ref<boolean>;
  /** Starts the first batch with the current filters. */
  initialize: () => Promise<void>;
  /** Restarts from the displayed question and returns the new batch, failures included, instead of throwing. */
  restartFromCurrentIndex: () => Promise<AsyncResult<Question[]>>;
  /** Clears the exhaustion and no-match flags, then fetches another batch. */
  retryQuestionFetch: () => Promise<void>;
};

export type { UseGameQuestionFeed, UseGameQuestionFeedOptions };