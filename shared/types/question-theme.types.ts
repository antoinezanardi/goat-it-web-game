import type { QuestionThemeDto } from "@goat-it/schemas/question-theme";

type QuestionTheme = Omit<QuestionThemeDto, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

export type {
  QuestionTheme,
};