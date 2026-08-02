import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { QuestionTheme } from "#shared/types/question-theme.types";

type GameQuestionCardThemeHeaderProps = {
  theme: QuestionTheme;
  difficulty: QuestionCognitiveDifficulty;
  category: QuestionCategory;
};

export type { GameQuestionCardThemeHeaderProps };