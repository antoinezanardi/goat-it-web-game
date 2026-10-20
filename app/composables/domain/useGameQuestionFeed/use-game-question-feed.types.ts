import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";

type UseGameQuestionFeedOptions = {
  currentIndex: Ref<number>;
};

type UseGameQuestionFeed = {
  questions: Ref<Question[]>;
  isExhausted: Ref<boolean>;
  hasNoMatchingFiltersQuestions: Ref<boolean>;
  hasFetchError: Ref<boolean>;
  initialize: () => Promise<void>;
  restartFromCurrentIndex: () => Promise<AsyncResult<Question[]>>;
  retryQuestionFetch: () => Promise<void>;
};

export type { UseGameQuestionFeed, UseGameQuestionFeedOptions };