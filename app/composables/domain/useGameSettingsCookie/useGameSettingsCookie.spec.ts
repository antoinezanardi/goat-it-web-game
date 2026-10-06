import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GAME_SETTINGS_COOKIE_OPTIONS } from "~/composables/domain/useGameSettingsCookie/use-game-settings-cookie.constants";
import type { useGameSettingsCookie as UseGameSettingsCookieType } from "~/composables/domain/useGameSettingsCookie/useGameSettingsCookie";
import { GAME_SETTINGS_DEFAULTS } from "~/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";
import { CookieNames } from "#shared/enums/cookie.enums";

let useGameSettingsCookie: typeof UseGameSettingsCookieType;

describe("useGameSettingsCookie", () => {
  beforeEach(async() => {
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    useCookieMockState.cookieRef.value = null;
    ({ useGameSettingsCookie } = await import("~/composables/domain/useGameSettingsCookie/useGameSettingsCookie"));
  });

  describe("cookie registration", () => {
    it("should read the game settings cookie by name when called.", () => {
      useGameSettingsCookie();

      expect(useCookieMockState.capturedName.current).toBe(CookieNames.GAME_SETTINGS);
    });

    it("should read the game settings cookie with the shared cookie options when called.", () => {
      useGameSettingsCookie();

      expect(useCookieMockState.capturedOptions.current).toStrictEqual(GAME_SETTINGS_COOKIE_OPTIONS);
    });
  });

  describe("readGameSettingsCookie", () => {
    it("should return the parsed settings and default the cognitive difficulties when the cookie holds a legacy object.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: true }));
    });

    it("should strip unknown keys when the cookie holds extra properties.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true, extra: "value" };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: true }));
    });

    it("should return the defaults when the cookie holds an empty object.", () => {
      useCookieMockState.cookieRef.value = {};
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });

    it("should return the defaults when a known field has an invalid type.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: "enabled" };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });

    it("should return the defaults when the cookie is missing.", () => {
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });

    it.each<{ value: string | boolean | number | undefined }>([
      { value: undefined },
      { value: true },
      { value: "not-json" },
      { value: 42 },
    ])("should return the defaults when the cookie holds $value.", ({ value }) => {
      useCookieMockState.cookieRef.value = value;
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });
  });

  describe("writeGameSettingsCookie", () => {
    it("should assign the settings to the cookie when called.", () => {
      const settings: GameSettings = createFakeGameSettings({ isAdultContentEnabled: true });
      const { writeGameSettingsCookie } = useGameSettingsCookie();

      writeGameSettingsCookie(settings);

      expect(useCookieMockState.cookieRef.value).toStrictEqual(settings);
    });
  });
});