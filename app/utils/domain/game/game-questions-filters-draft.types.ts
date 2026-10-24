import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

/**
 * Question filters as edited by the player before they are persisted into game settings.
 */
type GameQuestionsFiltersDraft = {
  isAdultContentEnabled: boolean;
  cognitiveDifficulties: QuestionCognitiveDifficulty[];
  categories: QuestionCategory[];
  /**
   * When omitted, no theme filter is sent; it does not mean every theme is selected.
   */
  themeIds?: string[];
};

export type { GameQuestionsFiltersDraft };