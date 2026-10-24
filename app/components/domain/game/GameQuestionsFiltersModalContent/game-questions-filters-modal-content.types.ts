import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";
import type { QuestionThemeCatalogStatus } from "@/stores/domain/question-theme/question-themes.types";

type GameQuestionsFiltersModalContentProps = {
  draft: GameQuestionsFiltersDraft;
  activeThemeIds: string[];
  activeThemes: QuestionTheme[];
  catalogStatus: QuestionThemeCatalogStatus;
  isThemesCatalogAvailable: boolean;
};

type GameQuestionsFiltersModalContentEmits = {
  "update:isAdultContentEnabled": [value: boolean];
  "update:cognitiveDifficulties": [value: QuestionCognitiveDifficulty[]];
  "update:categories": [value: QuestionCategory[]];
  "update:themeIds": [value: string[]];
};

export type { GameQuestionsFiltersModalContentEmits, GameQuestionsFiltersModalContentProps };