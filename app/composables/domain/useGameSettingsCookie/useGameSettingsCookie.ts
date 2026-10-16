import { CookieNames } from "#shared/enums/cookie.enums";
import { GAME_SETTINGS_COOKIE_OPTIONS } from "~/composables/domain/useGameSettingsCookie/use-game-settings-cookie.constants";
import type { UseGameSettingsCookie } from "~/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS, GAME_SETTINGS_SCHEMA } from "~/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

function useGameSettingsCookie(): UseGameSettingsCookie {
  const cookie = useCookie<unknown>(CookieNames.GAME_SETTINGS, GAME_SETTINGS_COOKIE_OPTIONS);

  function readGameSettingsCookie(): GameSettings {
    const result = GAME_SETTINGS_SCHEMA.safeParse(cookie.value);

    if (!result.success) {
      return { ...GAME_SETTINGS_DEFAULTS };
    }
    return result.data;
  }

  function writeGameSettingsCookie(settings: GameSettings): void {
    cookie.value = settings;
  }
  return {
    readGameSettingsCookie,
    writeGameSettingsCookie,
  };
}

export { useGameSettingsCookie };