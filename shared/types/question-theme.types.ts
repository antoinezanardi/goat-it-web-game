import type { QuestionThemeDto } from "@goat-it/schemas/question-theme";

/**
 * Question theme mapped to the app domain, with real `Date` timestamps.
 */
type QuestionTheme = Omit<QuestionThemeDto, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
};

export type {
  QuestionTheme,
};