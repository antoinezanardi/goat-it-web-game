type UseGameSettingsSyncOptions = {
  restartFromCurrentIndex: () => Promise<void>;
};

type UseGameSettingsSync = {
  markFetchFiltersApplied: () => void;
  syncQuestionsWithGameSettings: () => Promise<void>;
};

export type { UseGameSettingsSync, UseGameSettingsSyncOptions };