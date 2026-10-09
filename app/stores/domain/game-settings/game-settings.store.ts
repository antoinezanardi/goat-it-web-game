import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

export const useGameSettingsStore = defineStore(StoreNames.GAME_SETTINGS, () => {
  const gameSettingsCookie = useGameSettingsCookie();
  const settings = ref<GameSettings>(gameSettingsCookie.readGameSettingsCookie());

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
  return {
    settings,
    setAdultContentEnabled,
    setCognitiveDifficulties,
    setCategories,
    setThemeIds,
  };
});