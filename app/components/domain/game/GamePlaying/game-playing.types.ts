import type { Question } from "#shared/types/question.types";

type GamePlayingProps = {
  canGoToPreviousQuestion: boolean;
  currentIndex: number;
  currentQuestion: Question;
  questions: Question[];
  areShortcutsDisabled?: boolean;
};

type GamePlayingEmits = {
  advance: [];
  previous: [];
};

export type { GamePlayingEmits, GamePlayingProps };