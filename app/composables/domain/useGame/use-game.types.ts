import type { Question } from "#shared/types/question.types";

type GamePageState = "loading" | "playing" | "game-over";

type UseGame = {
  canGoToPreviousQuestion: ComputedRef<boolean>;
  currentIndex: Ref<number>;
  currentQuestion: ComputedRef<Question | undefined>;
  isFetchingQuestions: ComputedRef<boolean>;
  isTranslating: ComputedRef<boolean>;
  questions: Ref<Question[]>;
  syncQuestionsWithGameSettings: () => Promise<void>;
  advanceToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  initialize: () => Promise<void>;
  gameState: ComputedRef<GamePageState>;
};

export type { GamePageState, UseGame };