import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { QuestionTheme } from "#shared/types/question-theme.types";

type GameQuestionCardThemeHeaderProps = {
  theme: QuestionTheme;
  icon: string;
  difficulty: QuestionCognitiveDifficulty;
};

export type { GameQuestionCardThemeHeaderProps };