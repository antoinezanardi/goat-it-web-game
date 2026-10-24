import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";

/**
 * Fetch filters derived from game settings and the active theme catalog.
 */
type UseGameFetchFilters = {
  /** Merged into every random-question request body. */
  fetchFilters: ComputedRef<GameSettingsFetchFilters>;
};

export type { UseGameFetchFilters };