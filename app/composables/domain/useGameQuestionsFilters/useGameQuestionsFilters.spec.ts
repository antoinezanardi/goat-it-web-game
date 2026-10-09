import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import type { useGameQuestionsFilters as UseGameQuestionsFiltersType } from "~/composables/domain/useGameQuestionsFilters/useGameQuestionsFilters";
import type { UseGameSettingsCookie } from "~/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS } from "~/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

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

  it("should count one active group when only the categories are narrowed.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], categories: ["trivia"] });

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(1);
  });

  it("should not count the theme group when no active theme catalog is available.", () => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], themeIds: ["theme-a"] });

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(0);
  });

  it("should count one active group when only the themes are narrowed with an available catalog.", () => {
    const settingsStore = mockStore(useGameSettingsStore);
    const questionThemesStore = mockStore(useQuestionThemesStore);
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], themeIds: ["theme-a"] });
    questionThemesStore.questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(1);
  });

  it("should not count the theme group when every active theme is selected.", () => {
    const settingsStore = mockStore(useGameSettingsStore);
    const questionThemesStore = mockStore(useQuestionThemesStore);
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], themeIds: ["theme-a", "theme-b"] });
    questionThemesStore.questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(0);
  });

  it("should not count the theme group when the saved theme ids are all stale.", () => {
    const settingsStore = mockStore(useGameSettingsStore);
    const questionThemesStore = mockStore(useQuestionThemesStore);
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], themeIds: ["stale-theme"] });
    questionThemesStore.questionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" })];

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(0);
  });

  it("should not count the theme group when the saved theme ids are unrestricted.", () => {
    const settingsStore = mockStore(useGameSettingsStore);
    const questionThemesStore = mockStore(useQuestionThemesStore);
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"], themeIds: [] });
    questionThemesStore.questionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" })];

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(0);
  });

  it("should count four active groups when all four groups are narrowed.", () => {
    const settingsStore = mockStore(useGameSettingsStore);
    const questionThemesStore = mockStore(useQuestionThemesStore);
    settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy"], categories: ["trivia"], themeIds: ["theme-a"] });
    questionThemesStore.questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];

    const { activeFiltersCount } = useGameQuestionsFilters();

    expect(activeFiltersCount.value).toBe(4);
  });
});