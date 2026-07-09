import type { QuestionDto } from "@goat-it/schemas/question";

import type { QuestionTheme } from "#shared/types/question-theme.types";

type QuestionThemeAssignment = Omit<QuestionDto["themes"][number], "theme"> & {
  theme: QuestionTheme;
};

type QuestionContent = QuestionDto["content"];

type QuestionAuthor = QuestionDto["author"];

type Question = Omit<QuestionDto, "createdAt" | "updatedAt" | "themes"> & {
  themes: QuestionThemeAssignment[];
  createdAt: Date;
  updatedAt: Date;
};

type QuestionRejection = NonNullable<QuestionDto["rejection"]>;

export type {
  Question,
  QuestionAuthor,
  QuestionContent,
  QuestionRejection,
  QuestionThemeAssignment,
};