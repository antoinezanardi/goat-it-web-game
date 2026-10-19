import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import { resolveSelectedThemeIds } from "#shared/utils/helpers/question-theme/selection/question-theme-selection.helpers";
import type { GameQuestionsFilterGroupDefinition } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";

const GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS: readonly GameQuestionsFilterGroupDefinition[] = [
  {
    buildFetchFilter: settings => (settings.isAdultContentEnabled ? {} : { isAdultContent: false }),
    isActiveInQuestionFiltersUi: settings => settings.isAdultContentEnabled,
  },
  {
    buildFetchFilter: settings => {
      if (settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length) {
        return { cognitiveDifficulties: [...settings.cognitiveDifficulties] };
      }
      return {};
    },
    isActiveInQuestionFiltersUi: settings => settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length,
  },
  {
    buildFetchFilter: settings => (settings.categories.length < QUESTION_CATEGORIES.length ? { categories: [...settings.categories] } : {}),
    isActiveInQuestionFiltersUi: settings => settings.categories.length < QUESTION_CATEGORIES.length,
  },
  {
    buildFetchFilter: (settings, activeThemeIds) => {
      if (activeThemeIds.length === 0) {
        return {};
      }
      const selectedThemeIds = resolveSelectedThemeIds(settings.themeIds, activeThemeIds);

      return selectedThemeIds !== undefined && selectedThemeIds.length < activeThemeIds.length ? { themeIds: selectedThemeIds } : {};
    },
    isActiveInQuestionFiltersUi: (settings, activeThemeIds) => {
      const selectedThemeIds = resolveSelectedThemeIds(settings.themeIds, activeThemeIds);

      return activeThemeIds.length > 0 && selectedThemeIds !== undefined && selectedThemeIds.length < activeThemeIds.length;
    },
  },
];

export { GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS };