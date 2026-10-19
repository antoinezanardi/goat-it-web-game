import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { defineComponent, nextTick, ref, toValue } from "vue";
import type { MaybeRefOrGetter, Ref } from "vue";

import { useAppToastMock } from "~~/tests/unit/setup/nuxt/composables/use-app-toast.nuxt.unit-setup";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createUseGameQuestionTranslationMock } from "~~/tests/unit/utils/mocks/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation.mock";
import type { UseGameQuestionTranslationMock } from "~~/tests/unit/utils/mocks/composables/domain/useGameQuestionTranslation/useGameQuestionTranslation.mock";

import type { useGame as UseGameType } from "@/composables/domain/useGame/useGame";
import type { UseGameSettingsCookie } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.constants";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import type { Question } from "#shared/types/question.types";
import { useGameStore } from "@/stores/domain/game/game.store";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

const GAME_DEFAULT_ADULT_CONTENT_FILTER_BODY = {
  ...GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY,
  isAdultContent: false,
} as const;

let useGame: typeof UseGameType;
let useGameQuestionTranslationMock: UseGameQuestionTranslationMock;
let capturedQuestions: Ref<Question[]> | undefined;
let capturedCanTranslateQuestions: MaybeRefOrGetter<boolean> | undefined;
let translationCallCount: number;
let wasGameSettingsResetReference!: Ref<boolean>;
let acknowledgeSettingsReset!: Mock<() => void>;

mockNuxtImport("useGameQuestionTranslation", () => (questions: Ref<Question[]>, canTranslateQuestions: MaybeRefOrGetter<boolean>): UseGameQuestionTranslationMock => {
  capturedQuestions = questions;
  capturedCanTranslateQuestions = canTranslateQuestions;
  translationCallCount += 1;

  return useGameQuestionTranslationMock;
});

mockNuxtImport("useGameSettingsCookie", () => (): UseGameSettingsCookie => ({
  readGameSettingsCookie: (): GameSettings => GAME_SETTINGS_DEFAULTS,
  writeGameSettingsCookie: vi.fn<UseGameSettingsCookie["writeGameSettingsCookie"]>(),
  wasGameSettingsReset: wasGameSettingsResetReference,
  acknowledgeSettingsReset,
}));

describe("useGame", () => {
  beforeEach(async() => {
    useGameQuestionTranslationMock = createUseGameQuestionTranslationMock();
    capturedQuestions = undefined;
    capturedCanTranslateQuestions = undefined;
    translationCallCount = 0;
    wasGameSettingsResetReference = ref<boolean>(false);
    acknowledgeSettingsReset = vi.fn<() => void>();
    createTestingPinia();
    mockStore(useGameStore).fetchAndAppendRandomQuestions.mockResolvedValue({ ok: true, value: [] });
    ({ useGame } = await import("@/composables/domain/useGame/useGame"));
  });

  describe("currentQuestion", () => {
    it("should be undefined when there are no questions.", () => {
      const game = useGame();

      expect(game.currentQuestion.value).toBeUndefined();
    });

    it("should expose the first question when questions are loaded.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
      store.questions = fakeQuestions;
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(fakeQuestions[0]);
    });
  });

  describe("canGoToPreviousQuestion", () => {
    it("should be false when currentIndex is 0.", () => {
      const game = useGame();

      expect(game.canGoToPreviousQuestion.value).toBe(false);
    });

    it("should be true when currentIndex is greater than 0.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
      store.questions = fakeQuestions;
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();

      expect(game.canGoToPreviousQuestion.value).toBe(true);
    });

    it("should be false when currentIndex is 0 after going back.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
      store.questions = fakeQuestions;
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      game.goToPreviousQuestion();
      await nextTick();

      expect(game.canGoToPreviousQuestion.value).toBe(false);
    });
  });

  describe("gameState", () => {
    it("should be 'loading' when questions are empty and a fetch is pending.", () => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.isPending = true;

      expect(game.gameState.value).toBe("loading");
    });

    it("should be 'loading' when currentIndex is beyond the questions, a fetch is pending and the game is not exhausted.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion(), createFakeQuestion()];
      store.isPending = true;
      await nextTick();
      game.advanceToNextQuestion();
      game.advanceToNextQuestion();
      await nextTick();

      expect(game.gameState.value).toBe("loading");
    });

    it("should be 'game-over' when exhausted and currentIndex is beyond the questions.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.gameState.value).toBe("game-over");
    });

    it("should be 'game-over' when the game is exhausted and a fetch is still pending.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();
      store.isPending = true;
      await nextTick();

      expect(game.gameState.value).toBe("game-over");
    });

    it("should be 'game-over' when currentIndex is beyond the questions, no fetch is pending, and the game is exhausted.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion(), createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.gameState.value).toBe("game-over");
    });

    it("should be 'playing' when there is a current question and a fetch is pending.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion()];
      store.isPending = true;
      await nextTick();

      expect(game.gameState.value).toBe("playing");
    });

    it("should be 'loading' when questions are empty, no fetch is pending, and the game is not exhausted.", () => {
      const game = useGame();

      expect(game.gameState.value).toBe("loading");
    });

    it("should be 'playing' when currentIndex is below the questions length.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion(), createFakeQuestion()];
      await nextTick();

      expect(game.gameState.value).toBe("playing");
    });

    it("should be 'empty-filters' when a narrowed fetch succeeds with no questions.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const game = useGame();
      settingsStore.settings = { ...GAME_SETTINGS_DEFAULTS, categories: ["trivia"] };

      await game.initialize();

      expect(game.gameState.value).toBe("empty-filters");
    });

    it("should be 'playing' rather than 'empty-filters' when a playable question remains.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      const game = useGame();
      settingsStore.settings = { ...GAME_SETTINGS_DEFAULTS, categories: ["trivia"] };
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => {
        store.questions = [createFakeQuestion()];
        await nextTick();

        return { ok: true, value: store.questions };
      });

      await game.initialize();

      expect(game.gameState.value).toBe("playing");
    });

    it("should be 'error' when the initial fetch fails and there is no playable question.", async() => {
      const store = mockStore(useGameStore);
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });
      const game = useGame();

      await game.initialize();

      expect(game.gameState.value).toBe("error");
    });

    it("should be 'error' when a prefetch fails at the end of the loaded questions.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion()];
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.gameState.value).toBe("error");
    });

    it("should be 'loading' when a retry is pending after a fetch error.", async() => {
      const store = mockStore(useGameStore);
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });
      const game = useGame();
      await game.initialize();
      store.isPending = true;
      await nextTick();

      expect(game.gameState.value).toBe("loading");
    });
  });

  describe("advanceToNextQuestion", () => {
    it("should increment currentIndex when the game is not over.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 10 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(fakeQuestions[1]);
    });

    it("should not increment currentIndex when the game is over.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 10 }, () => createFakeQuestion());
      const appendedQuestions = [createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
      store.questions = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 10; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      game.advanceToNextQuestion();
      await nextTick();
      store.questions = [...fakeQuestions, ...appendedQuestions];
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(appendedQuestions[0]);
    });
  });

  describe("goToPreviousQuestion", () => {
    it("should decrement currentIndex when canGoToPreviousQuestion is true.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
      store.questions = fakeQuestions;
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      game.goToPreviousQuestion();
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(fakeQuestions[0]);
    });

    it("should not decrement currentIndex when currentIndex is already 0.", () => {
      const game = useGame();

      game.goToPreviousQuestion();

      expect(game.currentQuestion.value).toBeUndefined();
    });
  });

  describe("isTranslating", () => {
    it.each<{ isTranslating: boolean; expected: boolean }>([
      { isTranslating: false, expected: false },
      { isTranslating: true, expected: true },
    ])("should be $expected when isTranslating is $isTranslating.", ({ isTranslating, expected }) => {
      useGameQuestionTranslationMock.isTranslatingRef.value = isTranslating;
      const game = useGame();

      expect(game.isTranslating.value).toBe(expected);
    });
  });

  describe("isFetchingQuestions", () => {
    it.each<{ isPending: boolean; isFetchingQuestionsByIds: boolean; expected: boolean }>([
      { isPending: false, isFetchingQuestionsByIds: false, expected: false },
      { isPending: true, isFetchingQuestionsByIds: false, expected: true },
      { isPending: false, isFetchingQuestionsByIds: true, expected: true },
      { isPending: true, isFetchingQuestionsByIds: true, expected: true },
    ])("should be $expected when isPending is $isPending and isFetchingQuestionsByIds is $isFetchingQuestionsByIds.", ({ isPending, isFetchingQuestionsByIds, expected }) => {
      const store = mockStore(useGameStore);
      store.isPending = isPending;
      store.isFetchingQuestionsByIds = isFetchingQuestionsByIds;
      const game = useGame();

      expect(game.isFetchingQuestions.value).toBe(expected);
    });
  });

  describe("question translation delegation", () => {
    it("should pass the questions ref to useGameQuestionTranslation when initialized.", () => {
      const game = useGame();

      expect(capturedQuestions).toBe(game.questions);
    });

    it("should call useGameQuestionTranslation exactly once when initialized.", () => {
      useGame();

      expect(translationCallCount).toBe(1);
    });
  });

  describe("canTranslateQuestions", () => {
    it("should return false when gameState is game-over.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(toValue(capturedCanTranslateQuestions)).toBe(false);
    });

    it("should return false when there are no questions.", () => {
      useGame();

      expect(toValue(capturedCanTranslateQuestions)).toBe(false);
    });

    it.each<{ isPending: boolean; isFetchingQuestionsByIds: boolean; expected: boolean }>([
      { isPending: true, isFetchingQuestionsByIds: false, expected: false },
      { isPending: false, isFetchingQuestionsByIds: true, expected: false },
      { isPending: false, isFetchingQuestionsByIds: false, expected: true },
    ])("should return $expected when pending is $isPending and by-ids fetch is $isFetchingQuestionsByIds.", async({ isPending, isFetchingQuestionsByIds, expected }) => {
      const store = mockStore(useGameStore);
      useGame();
      store.questions = [createFakeQuestion(), createFakeQuestion()];
      store.isPending = isPending;
      store.isFetchingQuestionsByIds = isFetchingQuestionsByIds;
      await nextTick();

      expect(toValue(capturedCanTranslateQuestions)).toBe(expected);
    });
  });

  describe("retry", () => {
    it("should refetch and return to playing when the retry succeeds.", async() => {
      const store = mockStore(useGameStore);
      store.fetchAndAppendRandomQuestions.mockResolvedValueOnce({ ok: false, error: new Error("fetch failed") });
      const game = useGame();
      await game.initialize();
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => {
        store.questions = [createFakeQuestion()];
        await nextTick();

        return { ok: true, value: store.questions };
      });

      await game.retry();

      expect(game.gameState.value).toBe("playing");
    });

    it("should keep the error state when the retry fails.", async() => {
      const store = mockStore(useGameStore);
      store.fetchAndAppendRandomQuestions.mockResolvedValue({ ok: false, error: new Error("fetch failed") });
      const game = useGame();
      await game.initialize();

      await game.retry();

      expect(game.gameState.value).toBe("error");
    });
  });

  describe("resetFilters", () => {
    it("should reset the game settings when invoked.", async() => {
      const settingsStore = mockStore(useGameSettingsStore);
      const game = useGame();

      await game.resetFilters();

      expect(settingsStore.resetSettings).toHaveBeenCalledExactlyOnceWith();
    });

    it("should refetch with the default filters when invoked.", async() => {
      const store = mockStore(useGameStore);
      const settingsStore = mockStore(useGameSettingsStore);
      settingsStore.settings = { ...GAME_SETTINGS_DEFAULTS, categories: ["trivia"] };
      settingsStore.resetSettings.mockImplementation(() => {
        settingsStore.settings = structuredClone(GAME_SETTINGS_DEFAULTS);
      });
      const game = useGame();

      await game.resetFilters();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_ADULT_CONTENT_FILTER_BODY);
    });
  });

  describe("mounted lifecycle", () => {
    it("should trigger the initial fetch when mounted.", async() => {
      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      const store = mockStore(useGameStore);
      await flushPromises();
      wrapper.unmount();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_ADULT_CONTENT_FILTER_BODY);
    });

    it("should reset the game questions when mounted.", async() => {
      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      const store = mockStore(useGameStore);
      await flushPromises();
      wrapper.unmount();

      expect(store.resetQuestions).toHaveBeenCalledExactlyOnceWith();
    });

    it("should clear previously loaded questions before the initial fetch when mounted.", async() => {
      const initialWrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      const store = mockStore(useGameStore);
      await flushPromises();
      initialWrapper.unmount();
      store.fetchAndAppendRandomQuestions.mockClear();
      store.questions = [createFakeQuestion(), createFakeQuestion()];
      store.resetQuestions.mockImplementation(() => {
        store.questions = [];
      });

      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      await flushPromises();
      wrapper.unmount();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_ADULT_CONTENT_FILTER_BODY);
    });

    it("should show a warning toast when the settings cookie was reset.", async() => {
      wasGameSettingsResetReference.value = true;
      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      await flushPromises();
      wrapper.unmount();

      expect(useAppToastMock.instance.addWarningToast).toHaveBeenCalledExactlyOnceWith({ id: "game-settings-reset", description: "game.settings.resetNotice" });
    });

    it("should acknowledge the settings reset when the notice is shown.", async() => {
      wasGameSettingsResetReference.value = true;
      const settingsStore = mockStore(useGameSettingsStore);
      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      await flushPromises();
      wrapper.unmount();

      expect(settingsStore.acknowledgeSettingsReset).toHaveBeenCalledExactlyOnceWith();
    });

    it("should not show a warning toast when the settings cookie is valid.", async() => {
      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      await flushPromises();
      wrapper.unmount();

      expect(useAppToastMock.instance.addWarningToast).not.toHaveBeenCalled();
    });
  });
});