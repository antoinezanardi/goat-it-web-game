import type { Question } from "#shared/types/question.types";

type GameQuestionCardSwitcherDirection = "forward" | "backward";

type GameQuestionCardSwitcherProps = {
  direction: GameQuestionCardSwitcherDirection;
  enteringQuestion?: Question;
  leavingQuestion?: Question;
  question: Question;
};

type GameQuestionCardSwitcherEmits = {
  complete: [];
};

export type { GameQuestionCardSwitcherDirection, GameQuestionCardSwitcherEmits, GameQuestionCardSwitcherProps };