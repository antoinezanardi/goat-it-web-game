import { CookieNames } from "#shared/enums/cookie.enums";
import { GAME_SETTINGS_COOKIE_OPTIONS } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.constants";
import type { UseGameSettingsCookie } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS, GAME_SETTINGS_SCHEMA, GAME_SETTINGS_STORED_SCHEMA } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

/**
 * Reads and writes the persisted `game_settings` cookie and reports when its value had to be repaired.
 *
 * Reading validates the cookie with the settings schema. A missing cookie silently yields the defaults, while an
 * unreadable or outdated stored shape yields defaults or the salvageable value and sets `wasGameSettingsReset`.
 */
function useGameSettingsCookie(): UseGameSettingsCookie {
  const cookie = useCookie<unknown>(CookieNames.GAME_SETTINGS, GAME_SETTINGS_COOKIE_OPTIONS);
  const wasGameSettingsReset = ref<boolean>(false);

  function readGameSettingsCookie(): GameSettings {
    const result = GAME_SETTINGS_SCHEMA.safeParse(cookie.value);

    if (!result.success) {
      const defaults = structuredClone(GAME_SETTINGS_DEFAULTS);

      if (cookie.value !== null && cookie.value !== undefined) {
        wasGameSettingsReset.value = true;
      }
      return defaults;
    }

    if (cookie.value !== null && cookie.value !== undefined && !GAME_SETTINGS_STORED_SCHEMA.safeParse(cookie.value).success) {
      wasGameSettingsReset.value = true;
    }
    return result.data;
  }

  function writeGameSettingsCookie(settings: GameSettings): void {
    cookie.value = settings;
  }

  function acknowledgeSettingsReset(): void {
    wasGameSettingsReset.value = false;
  }
  return {
    wasGameSettingsReset,
    readGameSettingsCookie,
    writeGameSettingsCookie,
    acknowledgeSettingsReset,
  };
}

export { useGameSettingsCookie };