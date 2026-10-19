type UseGameSettingsSyncOptions = {
  restartFromCurrentIndex: () => Promise<boolean>;
};

type UseGameSettingsSync = {
  markFetchFiltersApplied: () => void;
  syncQuestionsWithGameSettings: () => Promise<boolean>;
};

export type { UseGameSettingsSync, UseGameSettingsSyncOptions };