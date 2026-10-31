import type { Question } from "#shared/types/question.types";
import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

type GameStateRendererProps = {
  areShortcutsDisabled: boolean;
  canGoToPreviousQuestion: boolean;
  currentIndex: number;
  currentQuestion: Question | undefined;
  gameState: GamePageState;
  isTranslating: boolean;
  questions: Question[];
};

type GameStateRendererEmits = {
  advance: [];
  previous: [];
  retry: [];
  resetFilters: [];
};

export type { GameStateRendererEmits, GameStateRendererProps };