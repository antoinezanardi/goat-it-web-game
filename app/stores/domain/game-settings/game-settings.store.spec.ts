import { beforeEach, describe, expect, it } from "vitest";

import type { useGameSettingsStore as UseGameSettingsStoreType } from "@/stores/domain/game-settings/game-settings.store";

let useGameSettingsStore: typeof UseGameSettingsStoreType;

describe("useGameSettingsStore", () => {
  beforeEach(async() => {
    ({ useGameSettingsStore } = await import("@/stores/domain/game-settings/game-settings.store"));
  });

  describe("isAdultContentEnabled", () => {
    it("should be false when created.", () => {
      const store = useGameSettingsStore();

      expect(store.isAdultContentEnabled).toBe(false);
    });
  });

  describe("setAdultContentEnabled", () => {
    it("should set isAdultContentEnabled to true when called with true.", () => {
      const store = useGameSettingsStore();

      store.setAdultContentEnabled(true);

      expect(store.isAdultContentEnabled).toBe(true);
    });

    it("should set isAdultContentEnabled to false when called with false.", () => {
      const store = useGameSettingsStore();
      store.isAdultContentEnabled = true;

      store.setAdultContentEnabled(false);

      expect(store.isAdultContentEnabled).toBe(false);
    });
  });
});