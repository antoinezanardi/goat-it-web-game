import type { Question } from "#shared/types/question.types";

type GameQuestionCardProps = {
  active?: boolean;
  frozen?: boolean;
  question: Question;
};

export type { GameQuestionCardProps };