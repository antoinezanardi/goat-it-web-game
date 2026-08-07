import { createTestingPinia } from "@pinia/testing";
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, nextTick } from "vue";

import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { useGame as UseGameType } from "~/composables/domain/useGame/useGame";
import { useGameStore } from "@/stores/domain/game/game.store";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY } from "~/pages/(game)/game.constants";

let useGame: typeof UseGameType;

describe("useGame", () => {
  beforeEach(async() => {
    createTestingPinia();
    ({ useGame } = await import("~/composables/domain/useGame/useGame"));
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
  });

  describe("initialize", () => {
    it("should trigger the initial fetch with the default query when invoked.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();

      await game.initialize();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should trigger the initial fetch when mounted.", async() => {
      const store = mockStore(useGameStore);
      const wrapper = mount(defineComponent({
        setup(): () => null {
          useGame();

          return (): null => null;
        },
      }));
      await flushPromises();
      wrapper.unmount();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY);
    });

    it("should set gameState to 'game-over' when the initial fetch returns no questions.", async() => {
      const game = useGame();

      await game.initialize();

      expect(game.gameState.value).toBe("game-over");
    });

    it("should not set gameState to 'game-over' when the initial fetch returns questions.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fetchedQuestions = [createFakeQuestion()];
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => new Promise<void>(resolve => {
        store.questions = fetchedQuestions;
        resolve();
      }));

      await game.initialize();

      expect(game.gameState.value).toBe("playing");
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

  describe("prefetch", () => {
    it("should trigger a prefetch with all loaded question ids excluded when currentIndex reaches the threshold.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.map(question => question.id),
      });
    });

    it("should not trigger a prefetch when currentIndex is below the threshold.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      for (let index = 0; index < 5; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a prefetch when a fetch is pending.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      store.isPending = true;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a prefetch when the game is exhausted.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      store.questions = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      store.fetchAndAppendRandomQuestions.mockClear();
      game.advanceToNextQuestion();
      await nextTick();

      expect(store.fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a second prefetch when the first prefetch is still in flight.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      let resolvePendingFetch: (() => void) | undefined;
      store.fetchAndAppendRandomQuestions.mockClear();
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => new Promise<void>(resolve => {
        resolvePendingFetch = resolve;
      }));
      store.questions = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      store.questions = [...fakeQuestions, ...Array.from({ length: 25 }, () => createFakeQuestion())];
      await nextTick();
      for (let index = 20; index < 40; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      resolvePendingFetch?.();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: fakeQuestions.map(question => question.id),
      });
    });

    it("should set gameState to 'game-over' when a prefetch returns no new questions.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      store.questions = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.gameState.value).toBe("game-over");
    });

    it("should re-arm the prefetch when the pending fetch completes.", async() => {
      const store = mockStore(useGameStore);
      const game = useGame();
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      let resolvePendingFetch: (() => void) | undefined;
      store.fetchAndAppendRandomQuestions.mockClear();
      store.fetchAndAppendRandomQuestions.mockImplementationOnce(async() => new Promise<void>(resolve => {
        resolvePendingFetch = resolve;
      }));
      store.questions = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      const allQuestions = [...fakeQuestions, ...Array.from({ length: 25 }, () => createFakeQuestion())];
      store.questions = allQuestions;
      await nextTick();
      resolvePendingFetch?.();
      await flushPromises();
      store.isPending = true;
      await nextTick();
      store.isPending = false;
      await nextTick();
      store.fetchAndAppendRandomQuestions.mockClear();
      for (let index = 20; index < 41; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(store.fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
        excludedIds: allQuestions.map(question => question.id),
      });
    });
  });
});