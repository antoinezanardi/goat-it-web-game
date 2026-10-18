import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";

type UseGameFetchFilters = {
  fetchFilters: ComputedRef<GameSettingsFetchFilters>;
};

export type { UseGameFetchFilters };