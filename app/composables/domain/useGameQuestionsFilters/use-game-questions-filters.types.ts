import type { ComputedRef } from "vue";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

type GameQuestionsFilterGroupActivityCheck = (settings: GameSettings) => boolean;

type UseGameQuestionsFilters = {
  activeFiltersCount: ComputedRef<number>;
};

export type { GameQuestionsFilterGroupActivityCheck, UseGameQuestionsFilters };