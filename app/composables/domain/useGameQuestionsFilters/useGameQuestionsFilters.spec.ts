import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import type { useGameQuestionsFilters as UseGameQuestionsFiltersType } from "~/composables/domain/useGameQuestionsFilters/useGameQuestionsFilters";
import type { UseGameSettingsCookie } from "~/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS } from "~/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

let useGameQuestionsFilters: typeof UseGameQuestionsFiltersType;

mockNuxtImport("useGameSettingsCookie", () => (): UseGameSettingsCookie => ({
  readGameSettingsCookie: (): GameSettings => GAME_SETTINGS_DEFAULTS,
  writeGameSettingsCookie: vi.fn<UseGameSettingsCookie["writeGameSettingsCookie"]>(),
}));

describe("useGameQuestionsFilters", () => {
  beforeEach(async() => {
    createTestingPinia();
    ({ useGameQuestionsFilters } = await import("~/composables/domain/useGameQuestionsFilters/useGameQuestionsFilters"));
  });

  it("should count zero active groups when adult content is disabled and every difficulty is selected.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(0);
  });

  it("should count one active group when only adult content is enabled.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(1);
  });

  it("should count one active group when only the cognitive difficulties are narrowed.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] });

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(1);
  });

  it("should count two active groups when adult content is enabled and the cognitive difficulties are narrowed.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["hard"] });

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(2);
  });

  it("should update the count when the committed settings change.", async() => {
    const settingsStore = mockStore(useGameSettingsStore);
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });

    const { activeFiltersCount } = useGameQuestionsFilters();
    const initialCount = activeFiltersCount.value;
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await nextTick();

    expect([initialCount, activeFiltersCount.value]).toStrictEqual([0, 1]);
  });
});