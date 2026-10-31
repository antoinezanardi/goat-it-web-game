import type { Question } from "#shared/types/question.types";

type GameQuestionCardThemeStackProps = {
  question: Question;
};

type GameQuestionCardThemeStackExposed = {
  playHighlight: () => Promise<void>;
  toggleOpen: () => void;
};

export type { GameQuestionCardThemeStackExposed, GameQuestionCardThemeStackProps };