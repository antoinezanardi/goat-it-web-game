import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GAME_SETTINGS_DEFAULTS, GAME_SETTINGS_SCHEMA, GAME_SETTINGS_STORED_SCHEMA } from "@/stores/domain/game-settings/game-settings.constants";
import type { useGameSettingsStore as UseGameSettingsStoreType } from "@/stores/domain/game-settings/game-settings.store";

let useGameSettingsStore: typeof UseGameSettingsStoreType;

describe("useGameSettingsStore", () => {
  beforeEach(async() => {
    useCookieMockState.cookieRef.value = null;
    ({ useGameSettingsStore } = await import("@/stores/domain/game-settings/game-settings.store"));
  });

  describe("settings", () => {
    it("should default to the default settings when the settings cookie is missing.", () => {
      const store = useGameSettingsStore();

      expect(store.settings).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });

    it("should be restored from the settings cookie when adult content is enabled.", () => {
      const settings = createFakeGameSettings({
        isAdultContentEnabled: true,
        categories: [...QUESTION_CATEGORIES],
        cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
        themeIds: ["theme-a"],
      });
      useCookieMockState.cookieRef.value = settings;
      const store = useGameSettingsStore();

      expect(store.settings).toStrictEqual(settings);
    });
  });

  describe("setAdultContentEnabled", () => {
    it.each<{ value: boolean }>([
      { value: true },
      { value: false },
    ])("should set settings.isAdultContentEnabled to $value when called with $value.", ({ value }) => {
      const store = useGameSettingsStore();
      store.settings = createFakeGameSettings({ isAdultContentEnabled: !value });

      store.setAdultContentEnabled(value);

      expect(store.settings.isAdultContentEnabled).toBe(value);
    });

    it("should write the whole settings object to the cookie when called.", () => {
      const store = useGameSettingsStore();

      store.setAdultContentEnabled(true);

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ ...GAME_SETTINGS_DEFAULTS, isAdultContentEnabled: true });
    });
  });

  describe("setCognitiveDifficulties", () => {
    it("should set settings.cognitiveDifficulties to the given values when called.", () => {
      const store = useGameSettingsStore();

      store.setCognitiveDifficulties(["easy", "hard"]);

      expect(store.settings.cognitiveDifficulties).toStrictEqual(["easy", "hard"]);
    });

    it("should write the whole settings object to the cookie when called.", () => {
      const store = useGameSettingsStore();
      const settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });
      store.settings = settings;

      store.setCognitiveDifficulties(["medium"]);

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ ...settings, cognitiveDifficulties: ["medium"] });
    });
  });

  describe("setCategories", () => {
    it("should set settings.categories to the given values when called.", () => {
      const store = useGameSettingsStore();

      store.setCategories(["trivia", "riddle"]);

      expect(store.settings.categories).toStrictEqual(["trivia", "riddle"]);
    });

    it("should write the whole settings object to the cookie when called.", () => {
      const store = useGameSettingsStore();
      const settings = createFakeGameSettings({
        isAdultContentEnabled: false,
        cognitiveDifficulties: ["easy", "medium", "hard"],
        categories: ["trivia", "lexicon", "riddle", "explanation"],
      });
      store.settings = settings;

      store.setCategories(["riddle"]);

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ ...settings, categories: ["riddle"] });
    });
  });

  describe("setThemeIds", () => {
    it("should set settings.themeIds to the given values when called.", () => {
      const store = useGameSettingsStore();

      store.setThemeIds(["theme-a", "theme-b"]);

      expect(store.settings.themeIds).toStrictEqual(["theme-a", "theme-b"]);
    });

    it("should write the whole settings object to the cookie when called.", () => {
      const store = useGameSettingsStore();
      const settings = createFakeGameSettings({
        isAdultContentEnabled: false,
        cognitiveDifficulties: ["easy", "medium", "hard"],
        categories: ["trivia", "lexicon", "riddle", "explanation"],
        themeIds: ["theme-b"],
      });
      store.settings = settings;

      store.setThemeIds(["theme-a"]);

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ ...settings, themeIds: ["theme-a"] });
    });
  });

  describe("resetSettings", () => {
    it("should restore the default settings when called.", () => {
      const store = useGameSettingsStore();
      store.settings = createFakeGameSettings({ isAdultContentEnabled: true, categories: ["trivia"] });

      store.resetSettings();

      expect(store.settings).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });

    it("should write the default settings to the cookie when called.", () => {
      const store = useGameSettingsStore();
      store.settings = createFakeGameSettings({ isAdultContentEnabled: true, categories: ["trivia"] });

      store.resetSettings();

      expect(useCookieMockState.cookieRef.value).toStrictEqual(GAME_SETTINGS_DEFAULTS);
    });
  });

  describe("wasGameSettingsReset", () => {
    it("should be true when an existing settings cookie was corrupt.", () => {
      useCookieMockState.cookieRef.value = "not-a-valid-settings-payload";
      const store = useGameSettingsStore();

      expect(store.wasGameSettingsReset).toBe(true);
    });

    it("should be false when the settings cookie is valid.", () => {
      useCookieMockState.cookieRef.value = createFakeGameSettings();
      const store = useGameSettingsStore();

      expect(store.wasGameSettingsReset).toBe(false);
    });
  });

  describe("acknowledgeSettingsReset", () => {
    it("should clear the reset flag when called.", () => {
      useCookieMockState.cookieRef.value = "not-a-valid-settings-payload";
      const store = useGameSettingsStore();

      store.acknowledgeSettingsReset();

      expect(store.wasGameSettingsReset).toBe(false);
    });

    it("should persist the repaired settings to the cookie when called.", () => {
      useCookieMockState.cookieRef.value = { isAdultContentEnabled: true, categories: [] };
      const store = useGameSettingsStore();

      store.acknowledgeSettingsReset();

      expect(useCookieMockState.cookieRef.value).toStrictEqual(store.settings);
    });
  });

  describe("settings schemas", () => {
    it("should validate the same settings fields when comparing the repairing and stored schemas.", () => {
      expect(Object.keys(GAME_SETTINGS_STORED_SCHEMA.shape)).toStrictEqual(Object.keys(GAME_SETTINGS_SCHEMA.shape));
    });
  });
});