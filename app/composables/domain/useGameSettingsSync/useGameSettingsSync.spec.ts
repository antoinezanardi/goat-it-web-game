import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { nextTick, ref } from "vue";

import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";
import type { useGameSettingsSync as UseGameSettingsSyncType } from "@/composables/domain/useGameSettingsSync/useGameSettingsSync";
import type { UseGameSettingsCookie } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { useGameStore } from "@/stores/domain/game/game.store";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

const UNRESTRICTED_SETTINGS_FIELDS: Partial<GameSettings> = {
  categories: [...QUESTION_CATEGORIES],
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
  themeIds: undefined,
};

let useGameSettingsSync: typeof UseGameSettingsSyncType;
let restartFromCurrentIndex: Mock<() => Promise<AsyncResult<Question[]>>>;

mockNuxtImport("useGameSettingsCookie", () => (): UseGameSettingsCookie => ({
  readGameSettingsCookie: (): GameSettings => GAME_SETTINGS_DEFAULTS,
  writeGameSettingsCookie: vi.fn<UseGameSettingsCookie["writeGameSettingsCookie"]>(),
  wasGameSettingsReset: ref<boolean>(false),
  acknowledgeSettingsReset: vi.fn<UseGameSettingsCookie["acknowledgeSettingsReset"]>(),
}));

describe("useGameSettingsSync", () => {
  beforeEach(async() => {
    restartFromCurrentIndex = vi.fn<() => Promise<AsyncResult<Question[]>>>().mockResolvedValue({ ok: true, value: [] });
    createTestingPinia();
    ({ useGameSettingsSync } = await import("@/composables/domain/useGameSettingsSync/useGameSettingsSync"));
  });

  describe("syncQuestionsWithGameSettings", () => {
    it("should not call restartFromCurrentIndex when the settings filters are unchanged.", async() => {
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });

      await syncQuestionsWithGameSettings();

      expect(restartFromCurrentIndex).not.toHaveBeenCalled();
    });

    it("should not call restartFromCurrentIndex when the settings are toggled away and back to the applied filters.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
      await syncQuestionsWithGameSettings();
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
      restartFromCurrentIndex.mockClear();

      await syncQuestionsWithGameSettings();

      expect(restartFromCurrentIndex).not.toHaveBeenCalled();
    });

    it("should not call restartFromCurrentIndex when the cognitive difficulties are toggled away and back to the applied filters.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] });
      await syncQuestionsWithGameSettings();
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false, cognitiveDifficulties: ["hard"] });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] });
      restartFromCurrentIndex.mockClear();

      await syncQuestionsWithGameSettings();

      expect(restartFromCurrentIndex).not.toHaveBeenCalled();
    });

    it("should call restartFromCurrentIndex when the settings filters change.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] });

      await syncQuestionsWithGameSettings();

      expect(restartFromCurrentIndex).toHaveBeenCalledExactlyOnceWith();
    });

    it("should apply the changed fetch filters when the settings filters change.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });

      await syncQuestionsWithGameSettings();
      await syncQuestionsWithGameSettings();

      expect(restartFromCurrentIndex).toHaveBeenCalledOnce();
    });

    it("should not call restartFromCurrentIndex when a fetch is pending until it completes.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      store.isPending = true;
      await nextTick();
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });

      const syncPromise = syncQuestionsWithGameSettings();
      await nextTick();

      expect(restartFromCurrentIndex).not.toHaveBeenCalled();

      store.isPending = false;
      await syncPromise;
      await flushPromises();
    });

    it("should synchronize when the active theme catalog loads and the derived filters change.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const questionThemesStore = mockStore(useQuestionThemesStore);
      useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a", "theme-b"] });
      questionThemesStore.questionThemes = [
        createFakeQuestionTheme({ id: "theme-a", status: "active" }),
        createFakeQuestionTheme({ id: "theme-b", status: "active" }),
      ];
      await nextTick();
      await flushPromises();

      expect(restartFromCurrentIndex).toHaveBeenCalledExactlyOnceWith();
    });

    it("should restart the feed when the saved theme filters become applied after the active theme catalog arrives.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const questionThemesStore = mockStore(useQuestionThemesStore);
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a"] });
      useGameSettingsSync({ restartFromCurrentIndex });
      await nextTick();
      await flushPromises();

      questionThemesStore.questionThemes = [
        createFakeQuestionTheme({ id: "theme-a", status: "active" }),
        createFakeQuestionTheme({ id: "theme-b", status: "active" }),
      ];
      await nextTick();
      await flushPromises();

      expect(restartFromCurrentIndex).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return a successful result when the filters are unchanged.", async() => {
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });

      await expect(syncQuestionsWithGameSettings()).resolves.toStrictEqual({ ok: true, value: undefined });
    });

    it("should return a successful result when the refetch succeeds.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });

      await expect(syncQuestionsWithGameSettings()).resolves.toStrictEqual({ ok: true, value: undefined });
    });

    it("should return a failed result when the refetch fails.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const error = new Error("fetch failed");
      restartFromCurrentIndex.mockResolvedValue({ ok: false, error });
      const { syncQuestionsWithGameSettings } = useGameSettingsSync({ restartFromCurrentIndex });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });

      await expect(syncQuestionsWithGameSettings()).resolves.toStrictEqual({ ok: false, error });
    });
  });
});