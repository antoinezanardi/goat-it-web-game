import { until } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { isEqual } from "radashi";

import type { AsyncResult } from "#shared/types/async-result.types";
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

  async function syncQuestionsWithGameSettings(): Promise<AsyncResult<void>> {
    if (isEqual(fetchFilters.value, appliedFetchFilters.value)) {
      return { ok: true, value: undefined };
    }
    await until(isPending).toBe(false);
    markFetchFiltersApplied();
    const result = await options.restartFromCurrentIndex();

    if (!result.ok) {
      return result;
    }
    return { ok: true, value: undefined };
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