import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

export const useGameSettingsStore = defineStore(StoreNames.GAME_SETTINGS, () => {
  const gameSettingsCookie = useGameSettingsCookie();
  const settings = ref<GameSettings>(gameSettingsCookie.readGameSettingsCookie());

  function setAdultContentEnabled(value: boolean): void {
    settings.value = { ...settings.value, isAdultContentEnabled: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }
  return {
    settings,
    setAdultContentEnabled,
  };
});