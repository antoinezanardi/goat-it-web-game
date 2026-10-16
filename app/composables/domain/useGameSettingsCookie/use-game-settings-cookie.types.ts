import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

type UseGameSettingsCookie = {
  readGameSettingsCookie: () => GameSettings;
  writeGameSettingsCookie: (settings: GameSettings) => void;
};

export type { UseGameSettingsCookie };