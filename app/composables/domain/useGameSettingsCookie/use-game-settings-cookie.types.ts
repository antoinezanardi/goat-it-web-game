import type { Ref } from "vue";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

type UseGameSettingsCookie = {
  wasGameSettingsReset: Ref<boolean>;
  readGameSettingsCookie: () => GameSettings;
  writeGameSettingsCookie: (settings: GameSettings) => void;
  acknowledgeSettingsReset: () => void;
};

export type { UseGameSettingsCookie };