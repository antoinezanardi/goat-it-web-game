import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";

type GamePageState = "loading" | "playing" | "game-over" | "error" | "no-matching-filters-questions";

type UseGame = {
  canGoToPreviousQuestion: ComputedRef<boolean>;
  currentIndex: Ref<number>;
  currentQuestion: ComputedRef<Question | undefined>;
  isFetchingQuestions: ComputedRef<boolean>;
  isTranslating: ComputedRef<boolean>;
  questions: Ref<Question[]>;
  syncQuestionsWithGameSettings: () => Promise<AsyncResult<void>>;
  advanceToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  initialize: () => Promise<void>;
  resetFilters: () => Promise<void>;
  retryQuestionFetch: () => Promise<void>;
  gameState: ComputedRef<GamePageState>;
};

export type { GamePageState, UseGame };