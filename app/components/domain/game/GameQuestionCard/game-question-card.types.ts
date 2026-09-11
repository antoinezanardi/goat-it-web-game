import type { Question } from "#shared/types/question.types";

type GameQuestionCardProps = {
  isActive?: boolean;
  isFrozen?: boolean;
  question: Question;
};

export type { GameQuestionCardProps };