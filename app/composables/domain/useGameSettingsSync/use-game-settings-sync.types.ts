import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";

type UseGameSettingsSyncOptions = {
  restartFromCurrentIndex: () => Promise<AsyncResult<Question[]>>;
};

type UseGameSettingsSync = {
  markFetchFiltersApplied: () => void;
  syncQuestionsWithGameSettings: () => Promise<AsyncResult<void>>;
};

export type { UseGameSettingsSync, UseGameSettingsSyncOptions };