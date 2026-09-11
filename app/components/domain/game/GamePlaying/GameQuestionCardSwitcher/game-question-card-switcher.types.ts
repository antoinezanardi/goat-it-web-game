import type { Question } from "#shared/types/question.types";

type GameQuestionCardSwitcherDirection = "forward" | "backward";

type GameQuestionCardSwitcherProps = {
  currentIndex: number;
  pendingDirection?: GameQuestionCardSwitcherDirection;
  questions: Question[];
};

type GameQuestionCardSwitcherEmits = {
  complete: [];
  staged: [];
};

export type { GameQuestionCardSwitcherDirection, GameQuestionCardSwitcherEmits, GameQuestionCardSwitcherProps };