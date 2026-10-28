import type { Ref } from "vue";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

/**
 * Cookie persistence contract returned by `useGameSettingsCookie`.
 */
type UseGameSettingsCookie = {
  /** True when the stored cookie was unreadable or outdated; cleared by `acknowledgeSettingsReset`. */
  wasGameSettingsReset: Ref<boolean>;
  /** Never throws; validates the cookie and falls back to a cloned default snapshot when it is invalid. */
  readGameSettingsCookie: () => GameSettings;
  /** Replaces the cookie value with the given settings. */
  writeGameSettingsCookie: (settings: GameSettings) => void;
  /** Clears the reset flag after the user has been warned. */
  acknowledgeSettingsReset: () => void;
};

export type { UseGameSettingsCookie };