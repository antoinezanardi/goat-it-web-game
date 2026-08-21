import type { QuestionTheme } from "#shared/types/question-theme.types";

type GameQuestionCardThemeIconSize = "md" | "sm";

type GameQuestionCardThemeIconProps = {
  theme: QuestionTheme;
  size?: GameQuestionCardThemeIconSize;
  isHint?: boolean;
};

export type { GameQuestionCardThemeIconProps, GameQuestionCardThemeIconSize };