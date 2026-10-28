import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";

type UseGameSettingsSyncOptions = {
  /** Restarts the feed from the displayed question; its failure is propagated unchanged. */
  restartFromCurrentIndex: () => Promise<AsyncResult<Question[]>>;
};

/**
 * Settings-sync actions returned by `useGameSettingsSync`.
 */
type UseGameSettingsSync = {
  /** Snapshots the current fetch filters as applied without fetching. */
  markFetchFiltersApplied: () => void;
  /** Resolves `ok` without fetching when the filters already match the applied ones. */
  syncQuestionsWithGameSettings: () => Promise<AsyncResult<void>>;
};

export type { UseGameSettingsSync, UseGameSettingsSyncOptions };