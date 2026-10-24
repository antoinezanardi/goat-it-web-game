import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { QuestionThemeCatalogStatus } from "@/stores/domain/question-theme/question-themes.types";

type GameQuestionsFiltersThemeFilterProps = {
  modelValue?: string[];
  activeThemeIds: string[];
  activeThemes: QuestionTheme[];
  catalogStatus: QuestionThemeCatalogStatus;
  isThemesCatalogAvailable: boolean;
};

type GameQuestionsFiltersThemeFilterEmits = {
  "update:modelValue": [value: string[]];
};

export type { GameQuestionsFiltersThemeFilterEmits, GameQuestionsFiltersThemeFilterProps };