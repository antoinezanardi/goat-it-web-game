import type { QuestionDto } from "@goat-it/schemas/question";

import type { QuestionTheme } from "#shared/types/question-theme.types";

/**
 * Theme assignment whose theme has been mapped to the domain object.
 */
type QuestionThemeAssignment = Omit<QuestionDto["themes"][number], "theme"> & {
  theme: QuestionTheme;
};

/**
 * Question context and trivia content in its DTO shape.
 */
type QuestionContent = QuestionDto["content"];

/**
 * Question author information in its DTO shape.
 */
type QuestionAuthor = QuestionDto["author"];

/**
 * Question mapped to the app domain.
 *
 * Timestamps are real `Date` objects, themes are resolved domain objects, and unsafe source URLs have already been filtered out.
 */
type Question = Omit<QuestionDto, "createdAt" | "updatedAt" | "themes"> & {
  themes: QuestionThemeAssignment[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Rejection details, omitted from the DTO when the question was not rejected.
 */
type QuestionRejection = NonNullable<QuestionDto["rejection"]>;

export type {
  Question,
  QuestionAuthor,
  QuestionContent,
  QuestionRejection,
  QuestionThemeAssignment,
};