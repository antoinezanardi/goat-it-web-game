import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import type { useGameFetchFilters as UseGameFetchFiltersType } from "@/composables/domain/useGameFetchFilters/useGameFetchFilters";
import type { UseGameSettingsCookie } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

const UNRESTRICTED_SETTINGS_FIELDS: Partial<GameSettings> = {
  categories: [...QUESTION_CATEGORIES],
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
  themeIds: undefined,
};

let useGameFetchFilters: typeof UseGameFetchFiltersType;

mockNuxtImport("useGameSettingsCookie", () => (): UseGameSettingsCookie => ({
  readGameSettingsCookie: (): GameSettings => GAME_SETTINGS_DEFAULTS,
  writeGameSettingsCookie: vi.fn<UseGameSettingsCookie["writeGameSettingsCookie"]>(),
}));

describe("useGameFetchFilters", () => {
  beforeEach(async() => {
    createTestingPinia();
    ({ useGameFetchFilters } = await import("@/composables/domain/useGameFetchFilters/useGameFetchFilters"));
  });

  it("should expose the fetch filters derived from the settings when created.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({
      ...UNRESTRICTED_SETTINGS_FIELDS,
      isAdultContentEnabled: false,
      categories: ["trivia"],
    });

    const { fetchFilters } = useGameFetchFilters();

    expect(fetchFilters.value).toStrictEqual({ isAdultContent: false, categories: ["trivia"] });
  });

  it("should update the fetch filters when the settings change.", async() => {
    const settingsStore = mockStore(useGameSettingsStore);
    settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });

    const { fetchFilters } = useGameFetchFilters();
    const initialFetchFilters = fetchFilters.value;
    settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
    await nextTick();

    expect([initialFetchFilters, fetchFilters.value]).toStrictEqual([{ isAdultContent: false }, {}]);
  });

  it("should update the fetch filters when the active theme catalog changes.", async() => {
    const settingsStore = mockStore(useGameSettingsStore);
    const questionThemesStore = mockStore(useQuestionThemesStore);
    settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a"] });

    const { fetchFilters } = useGameFetchFilters();
    const initialFetchFilters = fetchFilters.value;
    questionThemesStore.questionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" })];
    await nextTick();

    expect([initialFetchFilters, fetchFilters.value]).toStrictEqual([{ themeIds: ["theme-a"] }, {}]);
  });
});