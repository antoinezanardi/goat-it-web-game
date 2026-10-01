import { beforeEach, describe, expect, it } from "vitest";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { useGameSettingsStore as UseGameSettingsStoreType } from "@/stores/domain/game-settings/game-settings.store";

let useGameSettingsStore: typeof UseGameSettingsStoreType;

describe("useGameSettingsStore", () => {
  beforeEach(async() => {
    // Acceptable as the useCookie guard mock requires null as the initial value for the cookie guard
    // oxlint-disable-next-line unicorn/no-null
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

      expect(store.settings).toStrictEqual({ isAdultContentEnabled: true });
    });
  });

  describe("setAdultContentEnabled", () => {
    it.each<{ value: boolean }>([
      { value: true },
      { value: false },
    ])("should set settings.isAdultContentEnabled to $value when called with $value.", ({ value }) => {
      const store = useGameSettingsStore();
      store.settings = { isAdultContentEnabled: !value };

      store.setAdultContentEnabled(value);

      expect(store.settings.isAdultContentEnabled).toBe(value);
    });

    it("should write the whole settings object to the cookie when called.", () => {
      const store = useGameSettingsStore();

      store.setAdultContentEnabled(true);

      expect(useCookieMockState.cookieRef.value).toStrictEqual({ isAdultContentEnabled: true });
    });
  });
});