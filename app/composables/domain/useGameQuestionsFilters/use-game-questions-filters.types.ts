import type { ComputedRef } from "vue";

/**
 * Active-filter summary returned by `useGameQuestionsFilters`.
 */
type UseGameQuestionsFilters = {
  /** Count rendered by the filters badges. */
  activeFiltersCount: ComputedRef<number>;
};

export type { UseGameQuestionsFilters };