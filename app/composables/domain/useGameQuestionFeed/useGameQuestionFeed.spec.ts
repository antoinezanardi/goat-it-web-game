import { FetchError } from "ofetch";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { flushPromises } from "@vue/test-utils";
import type { UseNetworkReturn } from "@vueuse/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";

import { createUseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import type { UseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import { createUseNetworkMock, createUseNetworkReturn } from "~~/tests/unit/utils/mocks/composables/core/useNetwork/useNetwork.mock";
import type { UseNetworkMock } from "~~/tests/unit/utils/mocks/composables/core/useNetwork/useNetwork.mock";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import type { Question } from "#shared/types/question.types";
import type { useGameQuestionFeed as UseGameQuestionFeedType } from "@/composables/domain/useGameQuestionFeed/useGameQuestionFeed";
import type { UseGameSettingsCookie } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY, GAME_EXCLUDED_IDS_MAXIMUM } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.constants";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { useGameStore } from "@/stores/domain/game/game.store";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

const GAME_DEFAULT_ADULT_CONTENT_FILTER_BODY = {
  ...GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY,
  isAdultContent: false,
} as const;

const UNRESTRICTED_SETTINGS_FIELDS: Partial<GameSettings> = {
  categories: [...QUESTION_CATEGORIES],
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
  themeIds: undefined,
};

function createFetchErrorWithoutResponse(): FetchError {
  return new FetchError("fetch failed");
}

function createFetchErrorWithResponse(): FetchError {
  const fetchError = new FetchError("fetch failed");
  fetchError.response = { status: 500 } as unknown as FetchError["response"];

  return fetchError;
}

let useGameQuestionFeed: typeof UseGameQuestionFeedType;
let useGoatItApiErrorToastMock: UseGoatItApiErrorToastMock;
let useNetworkMock: UseNetworkMock;

mockNuxtImport("useGoatItApiErrorToast", () => (): UseGoatItApiErrorToastMock => useGoatItApiErrorToastMock);
mockNuxtImport("useNetwork", () => (): UseNetworkReturn => createUseNetworkReturn(useNetworkMock));

mockNuxtImport("useGameSettingsCookie", () => (): UseGameSettingsCookie => ({
  readGameSettingsCookie: (): GameSettings => GAME_SETTINGS_DEFAULTS,
  writeGameSettingsCookie: vi.fn<UseGameSettingsCookie["writeGameSettingsCookie"]>(),
  wasGameSettingsReset: ref<boolean>(false),
  acknowledgeSettingsReset: vi.fn<UseGameSettingsCookie["acknowledgeSettingsReset"]>(),
}));

describe("useGameQuestionFeed", () => {
  beforeEach(async() => {
    useGoatItApiErrorToastMock = createUseGoatItApiErrorToastMock();
    useNetworkMock = createUseNetworkMock();
    createTestingPinia();
    mockStore(useGameStore).fetchAndAppendRandomQuestions.mockResolvedValue({ ok: true, value: [] });
    ({ useGameQuestionFeed } = await import("@/composables/domain/useGameQuestionFeed/useGameQuestionFeed"));
  });

  describe("initialize", () => {
    it("should trigger the initial fetch with the default query when invoked.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_ADULT_CONTENT_FILTER_BODY);
    });

    it("should omit the adult content filter from the initial fetch body when adult content is enabled.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should include only the selected cognitive difficulties in the initial fetch body when a partial selection is set.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "hard"] });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        cognitiveDifficulties: ["easy", "hard"],
      });
    });

    it("should omit the cognitive difficulties from the initial fetch body when every difficulty is selected.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({
        ...UNRESTRICTED_SETTINGS_FIELDS,
        isAdultContentEnabled: true,
        cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should include only the selected categories in the initial fetch body when a partial selection is set.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, categories: ["trivia", "riddle"] });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        categories: ["trivia", "riddle"],
      });
    });

    it("should omit the categories from the initial fetch body when every category is selected.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, categories: [...QUESTION_CATEGORIES] });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should omit the saved theme ids from the initial fetch body when no catalog is available.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a"] });

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should include only the narrowed active theme ids in the initial fetch body when a catalog is available.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const questionThemesStore = mockStore(useQuestionThemesStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a"] });
      questionThemesStore.questionThemes = [
        createFakeQuestionTheme({ id: "theme-a", status: "active" }),
        createFakeQuestionTheme({ id: "theme-b", status: "active" }),
      ];

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        themeIds: ["theme-a"],
      });
    });

    it("should omit the theme ids from the initial fetch body when every active theme is selected.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const questionThemesStore = mockStore(useQuestionThemesStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a", "theme-b"] });
      questionThemesStore.questionThemes = [
        createFakeQuestionTheme({ id: "theme-a", status: "active" }),
        createFakeQuestionTheme({ id: "theme-b", status: "active" }),
      ];

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should omit the theme ids from the initial fetch body when every saved theme id is stale.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const questionThemesStore = mockStore(useQuestionThemesStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["stale-theme"] });
      questionThemesStore.questionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" })];

      await feed.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should mark the game exhausted when the initial fetch returns no questions.", async() => {
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });

      await feed.initialize();

      expect(feed.isExhausted.value).toBe(true);
    });

    it("should not mark the game exhausted when the initial fetch returns questions.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      const fetchedQuestions = [createFakeQuestion()];
      store.fetchAndAppendRandomQuestions.mockResolvedValueOnce({ ok: true, value: fetchedQuestions });
      store.questions = fetchedQuestions;

      await feed.initialize();

      expect(feed.isExhausted.value).toBe(false);
    });

    it("should show the API error toast when a fetch fails.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      const error = new Error("fetch failed");
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error });

      await feed.initialize();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(error, { title: "questions.cantFetch", context: "questions" });
    });

    it("should not show the API error toast when a fetch fails without a response while offline.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      useNetworkMock.isOnlineRef.value = false;
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: createFetchErrorWithoutResponse() });

      await feed.initialize();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).not.toHaveBeenCalled();
    });

    it("should record the fetch error when a fetch fails without a response while offline.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      useNetworkMock.isOnlineRef.value = false;
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: createFetchErrorWithoutResponse() });

      await feed.initialize();

      expect(feed.hasFetchError.value).toBe(true);
    });

    it("should show the API error toast when a fetch fails with a response while offline.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      const error = createFetchErrorWithResponse();
      useNetworkMock.isOnlineRef.value = false;
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error });

      await feed.initialize();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(error, { title: "questions.cantFetch", context: "questions" });
    });

    it("should show the API error toast when a fetch fails without a response while online.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      const error = createFetchErrorWithoutResponse();
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error });

      await feed.initialize();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(error, { title: "questions.cantFetch", context: "questions" });
    });

    it("should not append questions when a fetch fails.", async() => {
      const store = mockStore(useGameStore);
      const existingQuestions = [createFakeQuestion()];
      store.questions = existingQuestions;
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      await feed.initialize();

      expect(feed.questions.value).toStrictEqual(existingQuestions);
    });

    it("should expose a fetch error and not exhaustion when the initial fetch fails.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      await feed.initialize();

      expect({ hasFetchError: feed.hasFetchError.value, isExhausted: feed.isExhausted.value }).toStrictEqual({ hasFetchError: true, isExhausted: false });
    });

    it("should clear the fetch error when a later initialize succeeds.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValueOnce({ ok: false, error: new Error("fetch failed") });
      await feed.initialize();
      store.fetchAndAppendRandomQuestions.mockResolvedValueOnce({ ok: true, value: [createFakeQuestion()] });

      await feed.initialize();

      expect(feed.hasFetchError.value).toBe(false);
    });

    it("should not flag an empty-filter state when a successful empty fetch has no narrowing filters.", async() => {
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });

      await feed.initialize();

      expect(feed.hasNoMatchingFiltersQuestions.value).toBe(false);
    });

    it("should flag an empty-filter state and not exhaustion when a successful empty fetch narrows categories.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, categories: ["trivia"] });

      await feed.initialize();

      expect({
        hasNoMatchingFiltersQuestions: feed.hasNoMatchingFiltersQuestions.value,
        isExhausted: feed.isExhausted.value,
      }).toStrictEqual({
        hasNoMatchingFiltersQuestions: true,
        isExhausted: false,
      });
    });

    it("should flag an empty-filter state when a successful empty fetch narrows cognitive difficulties.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, cognitiveDifficulties: ["easy"] });

      await feed.initialize();

      expect(feed.hasNoMatchingFiltersQuestions.value).toBe(true);
    });

    it("should flag an empty-filter state when a successful empty fetch narrows themes.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const questionThemesStore = mockStore(useQuestionThemesStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, themeIds: ["theme-a"] });
      questionThemesStore.questionThemes = [
        createFakeQuestionTheme({ id: "theme-a", status: "active" }),
        createFakeQuestionTheme({ id: "theme-b", status: "active" }),
      ];

      await feed.initialize();

      expect(feed.hasNoMatchingFiltersQuestions.value).toBe(true);
    });

    it("should clear the empty-filter state when a later fetch returns questions.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, categories: ["trivia"] });
      await feed.initialize();
      const fetchedQuestion = createFakeQuestion();
      store.questions = [fetchedQuestion];
      store.fetchAndAppendRandomQuestions.mockResolvedValueOnce({ ok: true, value: [fetchedQuestion] });

      await feed.retryQuestionFetch();

      expect(feed.hasNoMatchingFiltersQuestions.value).toBe(false);
    });

    it("should not show the API error toast when the fetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, superseded: true });

      await feed.initialize();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).not.toHaveBeenCalled();
    });

    it("should not flag a fetch error when the fetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, superseded: true });

      await feed.initialize();

      expect(feed.hasFetchError.value).toBe(false);
    });

    it("should leave the exhaustion and empty-filter flags unchanged when the fetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, superseded: true });

      await feed.initialize();

      expect({
        isExhausted: feed.isExhausted.value,
        hasNoMatchingFiltersQuestions: feed.hasNoMatchingFiltersQuestions.value,
      }).toStrictEqual({
        isExhausted: false,
        hasNoMatchingFiltersQuestions: false,
      });
    });
  });

  describe("prefetch", () => {
    it("should trigger a prefetch with all loaded question ids excluded when currentIndex reaches the threshold.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.toReversed().map(question => question.id),
        isAdultContent: false,
      });
    });

    it("should omit the adult content filter from the prefetch body when adult content is enabled.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.toReversed().map(question => question.id),
      });
    });

    it("should include only the selected cognitive difficulties in the prefetch body when a partial selection is set.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, cognitiveDifficulties: ["hard"] });
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.toReversed().map(question => question.id),
        cognitiveDifficulties: ["hard"],
      });
    });

    it("should not trigger a prefetch when currentIndex is below the threshold.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      store.questions = Array.from({ length: 25 }, () => createFakeQuestion());
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 5;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a prefetch when a fetch is pending.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      store.questions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.isPending = true;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a prefetch when the game is exhausted.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      store.questions = Array.from({ length: 25 }, () => createFakeQuestion());
      await nextTick();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 21;
      await nextTick();

      expect(store.fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a second prefetch when the first prefetch is still in flight.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      const appendedQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      const allQuestions = [...fakeQuestions, ...appendedQuestions];
      let resolvePendingFetch: (() => void) | undefined;
      store.fetchAndAppendRandomQuestions.mockClear();
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => new Promise<{ ok: true; value: Question[] }>(resolve => {
        resolvePendingFetch = (): void => resolve({ ok: true, value: appendedQuestions });
      }));
      store.questions = fakeQuestions;
      await nextTick();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();
      store.questions = allQuestions;
      await nextTick();
      currentIndex.value = 40;
      await nextTick();
      await flushPromises();
      resolvePendingFetch?.();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.toReversed().map(question => question.id),
        isAdultContent: false,
      });
    });

    it("should mark the game exhausted when a prefetch returns no new questions.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      const feed = useGameQuestionFeed({ currentIndex });
      store.questions = [createFakeQuestion()];
      await nextTick();
      currentIndex.value = 1;
      await nextTick();
      await flushPromises();

      expect(feed.isExhausted.value).toBe(true);
    });

    it("should re-arm the prefetch when the pending fetch completes.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      const appendedQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      const allQuestions = [...fakeQuestions, ...appendedQuestions];
      let resolvePendingFetch: (() => void) | undefined;
      store.fetchAndAppendRandomQuestions.mockClear();
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => new Promise<{ ok: true; value: Question[] }>(resolve => {
        resolvePendingFetch = (): void => resolve({ ok: true, value: appendedQuestions });
      }));
      store.questions = fakeQuestions;
      await nextTick();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();
      store.questions = allQuestions;
      await nextTick();
      resolvePendingFetch?.();
      await flushPromises();
      store.isPending = true;
      await nextTick();
      store.isPending = false;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 40;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: allQuestions.toReversed().map(question => question.id),
        isAdultContent: false,
      });
    });

    it("should cap the excluded ids to the maximum when more than the maximum questions are loaded.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const fakeQuestions = Array.from({ length: GAME_EXCLUDED_IDS_MAXIMUM + 5 }, (_unused, index) => createFakeQuestion({ id: `question-${index}` }));
      store.questions = fakeQuestions;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = Math.ceil(fakeQuestions.length * 0.8);
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.slice(-GAME_EXCLUDED_IDS_MAXIMUM).toReversed().map(question => question.id),
        isAdultContent: false,
      });
    });

    it("should keep the most recent unique ids when the loaded questions contain duplicates.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      const sharedQuestion = createFakeQuestion({ id: "shared-question" });
      const lastQuestion = createFakeQuestion({ id: "last-question" });
      store.questions = [sharedQuestion, sharedQuestion, lastQuestion];
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 3;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: ["last-question", "shared-question"],
        isAdultContent: false,
      });
    });

    it("should not mark the game exhausted when a prefetch fails.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      const feed = useGameQuestionFeed({ currentIndex });
      store.questions = [createFakeQuestion()];
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      currentIndex.value = 1;
      await nextTick();
      await flushPromises();

      expect({ hasFetchError: feed.hasFetchError.value, isExhausted: feed.isExhausted.value }).toStrictEqual({ hasFetchError: true, isExhausted: false });
    });

    it("should fetch again when retry is called after a prefetch failure.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      const feed = useGameQuestionFeed({ currentIndex });
      store.questions = [createFakeQuestion()];
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });
      currentIndex.value = 1;
      await nextTick();
      await flushPromises();
      store.fetchAndAppendRandomQuestions.mockClear();

      await feed.retryQuestionFetch();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: store.questions.toReversed().map(question => question.id),
        isAdultContent: false,
      });
    });

    it("should not show the API error toast when the prefetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const currentIndex = ref<number>(0);
      useGameQuestionFeed({ currentIndex });
      store.questions = Array.from({ length: 25 }, () => createFakeQuestion());
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, superseded: true });
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).not.toHaveBeenCalled();
    });
  });

  describe("restartFromCurrentIndex", () => {
    it("should truncate the questions after the current one when invoked.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(4) });
      store.questions = Array.from({ length: 10 }, () => createFakeQuestion());
      await nextTick();

      await feed.restartFromCurrentIndex();

      expect(store.truncateQuestions).toHaveBeenCalledExactlyOnceWith(5);
    });

    it("should refetch with the current filters and the kept question ids excluded when invoked.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(4) });
      const fakeQuestions = Array.from({ length: 10 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      store.truncateQuestions.mockImplementation((length: number) => {
        store.questions = store.questions.slice(0, length);
      });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
      store.fetchAndAppendRandomQuestions.mockClear();

      await feed.restartFromCurrentIndex();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.slice(0, 5).toReversed().map(question => question.id),
      });
    });

    it("should mark the game exhausted when the refetch returns no new questions.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(1) });
      store.questions = Array.from({ length: 10 }, () => createFakeQuestion());
      await nextTick();
      store.truncateQuestions.mockImplementation((length: number) => {
        store.questions = store.questions.slice(0, length);
      });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });

      await feed.restartFromCurrentIndex();

      expect(feed.isExhausted.value).toBe(true);
    });

    it("should not mark the game exhausted when the refetch fails.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(1) });
      store.questions = Array.from({ length: 3 }, () => createFakeQuestion());
      await nextTick();
      store.truncateQuestions.mockImplementation((length: number) => {
        store.questions = store.questions.slice(0, length);
      });
      settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      await feed.restartFromCurrentIndex();

      expect(feed.isExhausted.value).toBe(false);
    });

    it("should keep the kept questions when the refetch fails.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(4) });
      const fakeQuestions = Array.from({ length: 10 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      store.truncateQuestions.mockImplementation((length: number) => {
        store.questions = store.questions.slice(0, length);
      });
      settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      await feed.restartFromCurrentIndex();

      expect(store.questions).toStrictEqual(fakeQuestions.slice(0, 5));
    });

    it("should retry the fetch on the next question when the refetch fails.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const currentIndex = ref(1);
      const feed = useGameQuestionFeed({ currentIndex });
      store.questions = Array.from({ length: 3 }, () => createFakeQuestion());
      await nextTick();
      store.truncateQuestions.mockImplementation((length: number) => {
        store.questions = store.questions.slice(0, length);
      });
      settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });
      await feed.restartFromCurrentIndex();
      store.fetchAndAppendRandomQuestions.mockClear();

      currentIndex.value = 2;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledOnce();
    });

    it("should reset the exhausted state when invoked.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      await feed.initialize();
      settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true });
      let resolveFetch: (() => void) | undefined;
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => new Promise<{ ok: true; value: [] }>(resolve => {
        resolveFetch = (): void => resolve({ ok: true, value: [] });
      }));

      const restartPromise = feed.restartFromCurrentIndex();
      await flushPromises();

      expect(feed.isExhausted.value).toBe(false);

      resolveFetch?.();
      await restartPromise;
      await flushPromises();
    });

    it("should re-arm the prefetch when invoked.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const currentIndex = ref(0);
      const feed = useGameQuestionFeed({ currentIndex });
      store.questions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.fetchAndAppendRandomQuestions.mockImplementation(async() => {
        await Promise.resolve();
        const fetchedQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
        store.questions = [...store.questions, ...fetchedQuestions];

        return { ok: true, value: fetchedQuestions };
      });
      await nextTick();
      currentIndex.value = 20;
      await nextTick();
      await flushPromises();
      store.truncateQuestions.mockImplementation((length: number) => {
        store.questions = store.questions.slice(0, length);
      });
      settingsStore.settings = createFakeGameSettings({ isAdultContentEnabled: true });
      await feed.restartFromCurrentIndex();
      store.fetchAndAppendRandomQuestions.mockClear();
      currentIndex.value = 36;
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledOnce();
    });

    it("should return a successful result when the refetch succeeds.", async() => {
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });

      await expect(feed.restartFromCurrentIndex()).resolves.toStrictEqual({ ok: true, value: [] });
    });

    it("should return a failed result when the refetch fails.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      const error = new Error("fetch failed");
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error });

      await expect(feed.restartFromCurrentIndex()).resolves.toStrictEqual({ ok: false, error });
    });

    it("should expose the empty-filter state when the refetch succeeds with narrowed filters and no questions.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, categories: ["trivia"] });

      await feed.restartFromCurrentIndex();

      expect(feed.hasNoMatchingFiltersQuestions.value).toBe(true);
    });

    it("should clear the empty-filter state when the refetch succeeds with questions.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true, categories: ["trivia"] });
      await feed.restartFromCurrentIndex();
      const fetchedQuestion = createFakeQuestion();
      store.questions = [fetchedQuestion];
      store.fetchAndAppendRandomQuestions.mockResolvedValueOnce({ ok: true, value: [fetchedQuestion] });

      await feed.restartFromCurrentIndex();

      expect(feed.hasNoMatchingFiltersQuestions.value).toBe(false);
    });

    it("should return the superseded result when the refetch is superseded.", async() => {
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, superseded: true });

      await expect(feed.restartFromCurrentIndex()).resolves.toStrictEqual({ ok: false, superseded: true });
    });

    it("should not show the API error toast when the refetch is superseded.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const store = mockStore(useGameStore);
      const feed = useGameQuestionFeed({ currentIndex: ref(0) });
      settingsStore.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, superseded: true });

      await feed.restartFromCurrentIndex();

      expect(useGoatItApiErrorToastMock.handleGoatItApiError).not.toHaveBeenCalled();
    });
  });
});