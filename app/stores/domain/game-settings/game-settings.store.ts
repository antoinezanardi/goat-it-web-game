import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";

/**
 * Owns the game settings persisted in the `game_settings` cookie.
 *
 * Consumers read `settings` and change it only through the setters, which keep the cookie in sync.
 */
export const useGameSettingsStore = defineStore(StoreNames.GAME_SETTINGS, () => {
  const gameSettingsCookie = useGameSettingsCookie();
  /** Current settings; replace values through the setters so the cookie stays in sync. */
  const settings = ref<GameSettings>(gameSettingsCookie.readGameSettingsCookie());
  /** True when a stored cookie value was invalid or stale, so some fields had to fall back. */
  const wasGameSettingsReset = computed<boolean>(() => gameSettingsCookie.wasGameSettingsReset.value);

  /** Replaces the adult-content preference and writes the settings cookie. */
  function setAdultContentEnabled(value: boolean): void {
    settings.value = { ...settings.value, isAdultContentEnabled: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  /** Replaces the cognitive-difficulty filter and writes the settings cookie. */
  function setCognitiveDifficulties(value: QuestionCognitiveDifficulty[]): void {
    settings.value = { ...settings.value, cognitiveDifficulties: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  /** Replaces the category filter and writes the settings cookie. */
  function setCategories(value: QuestionCategory[]): void {
    settings.value = { ...settings.value, categories: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  /** Replaces the theme filter and writes the settings cookie. */
  function setThemeIds(value: string[]): void {
    settings.value = { ...settings.value, themeIds: value };
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  /** Restores a deep copy of the defaults and writes the settings cookie. */
  function resetSettings(): void {
    settings.value = structuredClone(GAME_SETTINGS_DEFAULTS);
    gameSettingsCookie.writeGameSettingsCookie(settings.value);
  }

  /** Clears the reset notice and rewrites the normalized settings so a later read no longer reports a reset. */
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