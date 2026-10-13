import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

type GameQuestionsFiltersDraft = {
  isAdultContentEnabled: boolean;
  cognitiveDifficulties: QuestionCognitiveDifficulty[];
  categories: QuestionCategory[];
  themeIds?: string[];
};

type GameQuestionsFiltersModalProps = {
  isOpen: boolean;
  isApplyPending: boolean;
};

type GameQuestionsFiltersModalEmits = {
  "update:isOpen": [value: boolean];
  "applyFilters": [draft: GameQuestionsFiltersDraft];
};

export type { GameQuestionsFiltersDraft, GameQuestionsFiltersModalEmits, GameQuestionsFiltersModalProps };