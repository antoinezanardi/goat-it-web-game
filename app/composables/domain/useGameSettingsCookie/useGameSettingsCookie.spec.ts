import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GAME_SETTINGS_COOKIE_OPTIONS } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.constants";
import type { useGameSettingsCookie as UseGameSettingsCookieType } from "@/composables/domain/useGameSettingsCookie/useGameSettingsCookie";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { CookieNames } from "#shared/enums/cookie.enums";

const DEFAULTED_FILTERS = {
  categories: [...QUESTION_CATEGORIES],
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
};

let useGameSettingsCookie: typeof UseGameSettingsCookieType;

describe("useGameSettingsCookie", () => {
  beforeEach(async() => {
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    useCookieMockState.cookieRef.value = null;
    ({ useGameSettingsCookie } = await import("@/composables/domain/useGameSettingsCookie/useGameSettingsCookie"));
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
    it("should return the parsed settings and default the filter fields when the cookie holds a legacy object.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual({ isAdultContentEnabled: true, ...DEFAULTED_FILTERS });
    });

    it("should strip unknown keys when the cookie holds extra properties.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true, extra: "value" };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual({ isAdultContentEnabled: true, ...DEFAULTED_FILTERS });
    });

    it("should return the defaults when the cookie holds an empty cognitive difficulties array.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true, cognitiveDifficulties: [] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual({ isAdultContentEnabled: true, ...DEFAULTED_FILTERS });
    });

    it("should normalize the cognitive difficulties to unique values in canonical order when the cookie holds duplicates.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["hard", "hard", "easy"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual({
        isAdultContentEnabled: false,
        ...DEFAULTED_FILTERS,
        cognitiveDifficulties: ["easy", "hard"],
      });
    });

    it("should return the defaults when the cookie holds unknown cognitive difficulties.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["unknown"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie()).toStrictEqual({ isAdultContentEnabled: false, ...DEFAULTED_FILTERS });
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

    it("should default the categories to every category when the cookie omits them.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], themeIds: ["theme-a"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().categories).toStrictEqual([...QUESTION_CATEGORIES]);
    });

    it("should normalize the categories to unique values in canonical order when the cookie holds duplicates.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["riddle", "riddle", "trivia"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().categories).toStrictEqual(["trivia", "riddle"]);
    });

    it("should return the default categories when the cookie holds an empty categories array.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: [] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().categories).toStrictEqual([...QUESTION_CATEGORIES]);
    });

    it("should return the default categories when the cookie holds unknown categories.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["unknown"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().categories).toStrictEqual([...QUESTION_CATEGORIES]);
    });

    it("should return undefined theme ids when the cookie omits them.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["trivia"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().themeIds).toBeUndefined();
    });

    it("should return undefined theme ids when the cookie holds an empty theme ids array.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["trivia"], themeIds: [] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().themeIds).toBeUndefined();
    });

    it("should deduplicate the theme ids when the cookie holds duplicates.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["trivia"], themeIds: ["theme-b", "theme-a", "theme-b"] };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().themeIds).toStrictEqual(["theme-b", "theme-a"]);
    });

    it("should return undefined theme ids when the cookie holds an invalid theme ids value.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: false, cognitiveDifficulties: ["easy"], categories: ["trivia"], themeIds: "theme-a" };
      const { readGameSettingsCookie } = useGameSettingsCookie();

      expect(readGameSettingsCookie().themeIds).toBeUndefined();
    });

    it("should return independent defaults when the returned settings are mutated.", () => {
      const expectedDefaults = structuredClone(GAME_SETTINGS_DEFAULTS);
      const { readGameSettingsCookie } = useGameSettingsCookie();
      const firstRead = readGameSettingsCookie();
      firstRead.cognitiveDifficulties.push("easy");
      const secondRead = readGameSettingsCookie();

      expect(secondRead).toStrictEqual(expectedDefaults);
    });

    it("should not report a reset when the cookie is missing.", () => {
      const { readGameSettingsCookie, wasGameSettingsReset } = useGameSettingsCookie();

      readGameSettingsCookie();

      expect(wasGameSettingsReset.value).toBe(false);
    });

    it("should report a reset when an existing cookie cannot be parsed.", () => {
      useCookieMockState.cookieRef.value = "not-a-valid-settings-payload";
      const { readGameSettingsCookie, wasGameSettingsReset } = useGameSettingsCookie();

      readGameSettingsCookie();

      expect(wasGameSettingsReset.value).toBe(true);
    });

    it.each<{ description: string; cookieValue: Record<string, unknown> }>([
      { description: "an empty categories array", cookieValue: { categories: [] } },
      { description: "an unknown category", cookieValue: { categories: ["unknown"] } },
      { description: "an invalid adult content flag", cookieValue: { isAdultContentEnabled: "enabled" } },
      { description: "an invalid theme ids value", cookieValue: { themeIds: "theme-a" } },
    ])("should report a reset when $description is stored in the cookie.", ({ cookieValue }) => {
      useCookieMockState.cookieRef.value = cookieValue;
      const { readGameSettingsCookie, wasGameSettingsReset } = useGameSettingsCookie();

      readGameSettingsCookie();

      expect(wasGameSettingsReset.value).toBe(true);
    });

    it("should not report a reset when the cookie holds a legacy object omitting the filter fields.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true };
      const { readGameSettingsCookie, wasGameSettingsReset } = useGameSettingsCookie();

      readGameSettingsCookie();

      expect(wasGameSettingsReset.value).toBe(false);
    });

    it.each<{ description: string; cookieValue: Record<string, unknown> }>([
      { description: "duplicated categories", cookieValue: { categories: ["trivia", "trivia"] } },
      { description: "duplicated cognitive difficulties", cookieValue: { cognitiveDifficulties: ["easy", "easy"] } },
    ])("should not report a reset when $description is stored in the cookie.", ({ cookieValue }) => {
      useCookieMockState.cookieRef.value = cookieValue;
      const { readGameSettingsCookie, wasGameSettingsReset } = useGameSettingsCookie();

      readGameSettingsCookie();

      expect(wasGameSettingsReset.value).toBe(false);
    });
  });

  describe("acknowledgeSettingsReset", () => {
    it("should clear the reset flag when called.", () => {
      useCookieMockState.cookieRef.value = "not-a-valid-settings-payload";
      const { readGameSettingsCookie, acknowledgeSettingsReset, wasGameSettingsReset } = useGameSettingsCookie();
      readGameSettingsCookie();

      acknowledgeSettingsReset();

      expect(wasGameSettingsReset.value).toBe(false);
    });

    it("should not write the cookie when called.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true, categories: [] };
      const { readGameSettingsCookie, acknowledgeSettingsReset } = useGameSettingsCookie();
      readGameSettingsCookie();

      acknowledgeSettingsReset();

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ isAdultContentEnabled: true, categories: [] });
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