import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
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
      useCookieMockState.cookieRef.value = createFakeGameSettings({ isAdultContentEnabled: true });
      const store = useGameSettingsStore();

      expect(store.settings).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: true }));
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

      expect(useCookieMockState.cookieRef.value).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: true }));
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
      store.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });

      store.setCognitiveDifficulties(["medium"]);

      expect(useCookieMockState.cookieRef.value).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["medium"] }));
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
      store.settings = createFakeGameSettings({
        isAdultContentEnabled: false,
        cognitiveDifficulties: ["easy", "medium", "hard"],
        categories: ["trivia", "lexicon", "riddle", "explanation"],
      });

      store.setCategories(["riddle"]);

      expect(useCookieMockState.cookieRef.value).toStrictEqual(createFakeGameSettings({
        isAdultContentEnabled: false,
        cognitiveDifficulties: ["easy", "medium", "hard"],
        categories: ["riddle"],
      }));
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
      store.settings = createFakeGameSettings({
        isAdultContentEnabled: false,
        cognitiveDifficulties: ["easy", "medium", "hard"],
        categories: ["trivia", "lexicon", "riddle", "explanation"],
        themeIds: [],
      });

      store.setThemeIds(["theme-a"]);

      expect(useCookieMockState.cookieRef.value).toStrictEqual(createFakeGameSettings({
        isAdultContentEnabled: false,
        cognitiveDifficulties: ["easy", "medium", "hard"],
        categories: ["trivia", "lexicon", "riddle", "explanation"],
        themeIds: ["theme-a"],
      }));
    });
  });
});