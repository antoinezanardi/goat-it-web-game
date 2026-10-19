import type { Question } from "#shared/types/question.types";

type UseGameQuestionFeedOptions = {
  currentIndex: Ref<number>;
};

type UseGameQuestionFeed = {
  questions: Ref<Question[]>;
  isExhausted: Ref<boolean>;
  initialize: () => Promise<void>;
  restartFromCurrentIndex: () => Promise<void>;
};

export type { UseGameQuestionFeed, UseGameQuestionFeedOptions };