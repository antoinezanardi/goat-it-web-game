import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";
import type { QuestionThemeCatalogStatus } from "@/stores/domain/question-theme/question-themes.types";

type GameQuestionsFiltersModalContentProps = {
  filtersDraft: GameQuestionsFiltersDraft;
  activeQuestionThemeIds: string[];
  activeQuestionThemes: QuestionTheme[];
  themesCatalogStatus: QuestionThemeCatalogStatus;
  isThemesCatalogAvailable: boolean;
};

type GameQuestionsFiltersModalContentEmits = {
  "update:isAdultContentEnabled": [value: boolean];
  "update:cognitiveDifficulties": [value: QuestionCognitiveDifficulty[]];
  "update:categories": [value: QuestionCategory[]];
  "update:questionThemeIds": [value: string[]];
};

export type { GameQuestionsFiltersModalContentEmits, GameQuestionsFiltersModalContentProps };