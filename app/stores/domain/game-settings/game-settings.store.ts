import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";

export const useGameSettingsStore = defineStore(StoreNames.GAME_SETTINGS, () => {
  const gameSettingsCookie = useGameSettingsCookie();
  const settings = ref<GameSettings>(gameSettingsCookie.readGameSettingsCookie());
  const wasGameSettingsReset = computed<boolean>(() => gameSettingsCookie.wasGameSettingsReset.value);

  function setAdultContentEnabled(value: boolean): void {
    settings.value = { ...settings.value, isAdultContentEnabled: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  function setCognitiveDifficulties(value: QuestionCognitiveDifficulty[]): void {
    settings.value = { ...settings.value, cognitiveDifficulties: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  function setCategories(value: QuestionCategory[]): void {
    settings.value = { ...settings.value, categories: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  function setThemeIds(value: string[]): void {
    settings.value = { ...settings.value, themeIds: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  function resetSettings(): void {
    settings.value = structuredClone(GAME_SETTINGS_DEFAULTS);
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  function acknowledgeSettingsReset(): void {
    gameSettingsCookie.acknowledgeSettingsReset();
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }
  return {
    wasGameSettingsReset,
    acknowledgeSettingsReset,
    resetSettings,
    settings,
    setAdultContentEnabled,
    setCognitiveDifficulties,
    setCategories,
    setThemeIds,
  };
});