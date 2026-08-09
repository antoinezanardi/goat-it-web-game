import type { Question } from "#shared/types/question.types";

type GameQuestionCardTransitionProps = {
  leavingQuestion: Question;
  enteringQuestion: Question;
  direction: "forward" | "backward";
};

type GameQuestionCardTransitionEmits = {
  complete: [];
};

export type { GameQuestionCardTransitionEmits, GameQuestionCardTransitionProps };