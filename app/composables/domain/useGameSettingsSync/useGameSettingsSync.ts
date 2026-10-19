import { until } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { isEqual } from "radashi";

import { useGameFetchFilters } from "@/composables/domain/useGameFetchFilters/useGameFetchFilters";
import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { UseGameSettingsSync, UseGameSettingsSyncOptions } from "@/composables/domain/useGameSettingsSync/use-game-settings-sync.types";

function useGameSettingsSync(options: UseGameSettingsSyncOptions): UseGameSettingsSync {
  const store = useGameStore();
  const { isPending } = storeToRefs(store);
  const questionThemesStore = useQuestionThemesStore();
  const { fetchFilters } = useGameFetchFilters();

  const appliedFetchFilters = ref<GameSettingsFetchFilters>(fetchFilters.value);

  function markFetchFiltersApplied(): void {
    appliedFetchFilters.value = fetchFilters.value;
  }

  async function syncQuestionsWithGameSettings(): Promise<boolean> {
    if (isEqual(fetchFilters.value, appliedFetchFilters.value)) {
      return true;
    }
    await until(isPending).toBe(false);
    markFetchFiltersApplied();

    return options.restartFromCurrentIndex();
  }

  watch(() => questionThemesStore.activeQuestionThemeIds, async() => {
    await syncQuestionsWithGameSettings();
  });

  return {
    markFetchFiltersApplied,
    syncQuestionsWithGameSettings,
  };
}

export { useGameSettingsSync };