import type { Question } from "#shared/types/question.types";

type GamePageState = "loading" | "playing" | "game-over" | "error" | "empty-filters";

type UseGame = {
  canGoToPreviousQuestion: ComputedRef<boolean>;
  currentIndex: Ref<number>;
  currentQuestion: ComputedRef<Question | undefined>;
  isFetchingQuestions: ComputedRef<boolean>;
  isTranslating: ComputedRef<boolean>;
  questions: Ref<Question[]>;
  syncQuestionsWithGameSettings: () => Promise<boolean>;
  advanceToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  initialize: () => Promise<void>;
  resetFilters: () => Promise<void>;
  retry: () => Promise<void>;
  gameState: ComputedRef<GamePageState>;
};

export type { GamePageState, UseGame };