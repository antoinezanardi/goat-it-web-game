import type { Question } from "#shared/types/question.types";

type GameQuestionCardTransitionDirection = "forward" | "backward";

type GameQuestionCardTransitionProps = {
  leavingQuestion: Question;
  enteringQuestion: Question;
  direction: GameQuestionCardTransitionDirection;
};

type GameQuestionCardTransitionEmits = {
  complete: [];
};

export type { GameQuestionCardTransitionDirection, GameQuestionCardTransitionEmits, GameQuestionCardTransitionProps };