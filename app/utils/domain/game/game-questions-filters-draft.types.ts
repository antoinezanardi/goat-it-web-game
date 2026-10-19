import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

type GameQuestionsFiltersDraft = {
  isAdultContentEnabled: boolean;
  cognitiveDifficulties: QuestionCognitiveDifficulty[];
  categories: QuestionCategory[];
  themeIds?: string[];
};

export type { GameQuestionsFiltersDraft };