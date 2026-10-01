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
    it.each<{ value: boolean }>([
      { value: true },
      { value: false },
    ])("should set isAdultContentEnabled to $value when called with $value.", ({ value }) => {
      const store = useGameSettingsStore();
      store.isAdultContentEnabled = !value;

      store.setAdultContentEnabled(value);

      expect(store.isAdultContentEnabled).toBe(value);
    });
  });
});