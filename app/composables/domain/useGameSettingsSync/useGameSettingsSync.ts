import { isEqual } from "radashi";

import type { AsyncResult } from "#shared/types/async-result.types";
import { useGameFetchFilters } from "@/composables/domain/useGameFetchFilters/useGameFetchFilters";
import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { UseGameSettingsSync, UseGameSettingsSyncOptions } from "@/composables/domain/useGameSettingsSync/use-game-settings-sync.types";

/**
 * Restarts the feed when the settings-derived fetch filters differ from the last applied ones.
 *
 * Any in-flight fetch is awaited first, and the new filters are recorded as applied before the restart so a
 * concurrent sync sees them as already applied. Changes to the active theme ids run the same sync.
 */
function useGameSettingsSync(options: UseGameSettingsSyncOptions): UseGameSettingsSync {
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