import type { FindRandomQuestionsQueryDto } from "@goat-it/schemas/question";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { nextTick, ref } from "vue";
import type { Ref } from "vue";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { UseGame, useGame as UseGameType } from "~/composables/domain/useGame/useGame";
import type { Question } from "#shared/types/question.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY } from "~/pages/(game)/game.constants";

let questions: Ref<Question[]>;
let isPending: Ref<boolean>;
let fetchAndAppendRandomQuestions: Mock<(query?: FindRandomQuestionsQueryDto) => Promise<void>>;

mockNuxtImport(
  "useGameStore",
  () => (): { questions: Ref<Question[]>; isPending: Ref<boolean>; fetchAndAppendRandomQuestions: Mock<(query?: FindRandomQuestionsQueryDto) => Promise<void>> } => ({
    questions,
    isPending,
    fetchAndAppendRandomQuestions,
  }),
);

let useGame: typeof UseGameType;
let game: UseGame;

describe("useGame", () => {
  beforeEach(async() => {
    questions = ref([]);
    isPending = ref(false);
    fetchAndAppendRandomQuestions = vi.fn<(...arguments_: unknown[]) => Promise<void>>();
    ({ useGame } = await import("~/composables/domain/useGame/useGame"));
    game = useGame();
  });

  describe("currentQuestion", () => {
    it("should be undefined when there are no questions.", () => {
      expect(game.currentQuestion.value).toBeUndefined();
    });

    it("should expose the first question when questions are loaded.", async() => {
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
      questions.value = fakeQuestions;
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(fakeQuestions[0]);
    });
  });

  describe("isInitialLoading", () => {
    it("should be true when questions are empty and a fetch is pending.", () => {
      isPending.value = true;

      expect(game.isInitialLoading.value).toBe(true);
    });

    it("should be false when questions exist and a fetch is pending.", async() => {
      questions.value = [createFakeQuestion()];
      isPending.value = true;
      await nextTick();

      expect(game.isInitialLoading.value).toBe(false);
    });

    it("should be false when questions are empty and no fetch is pending.", () => {
      expect(game.isInitialLoading.value).toBe(false);
    });
  });

  describe("isOutOfQuestionsLoading", () => {
    it("should be true when currentIndex is beyond the questions, a fetch is pending and the game is not exhausted.", async() => {
      questions.value = [createFakeQuestion(), createFakeQuestion()];
      isPending.value = true;
      await nextTick();
      game.advanceToNextQuestion();
      game.advanceToNextQuestion();
      await nextTick();

      expect(game.isOutOfQuestionsLoading.value).toBe(true);
    });

    it("should be false when the game is exhausted.", async() => {
      questions.value = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();
      isPending.value = true;
      await nextTick();

      expect(game.isOutOfQuestionsLoading.value).toBe(false);
    });

    it("should be false when currentIndex is below the questions length.", async() => {
      questions.value = [createFakeQuestion(), createFakeQuestion()];
      await nextTick();

      expect(game.isOutOfQuestionsLoading.value).toBe(false);
    });

    it("should be false when currentIndex is beyond the questions and no fetch is pending.", async() => {
      questions.value = [createFakeQuestion(), createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.isOutOfQuestionsLoading.value).toBe(false);
    });
  });

  describe("isGameOver", () => {
    it("should be false initially when there are questions to play.", async() => {
      questions.value = [createFakeQuestion()];
      await nextTick();

      expect(game.isGameOver.value).toBe(false);
    });

    it("should be true when exhausted and currentIndex is beyond the questions.", async() => {
      questions.value = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.isGameOver.value).toBe(true);
    });
  });

  describe("initial fetch", () => {
    it("should trigger the initial fetch with the default query when the callOnce callback is invoked.", async() => {
      const initialFetch = vi.mocked(callOnce).mock.calls[0]?.[0] as (() => Promise<void>) | undefined;
      await initialFetch?.();

      expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith(GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY);
    });

    it("should mark the game as over when the initial fetch returns no questions.", async() => {
      const initialFetch = vi.mocked(callOnce).mock.calls[0]?.[0] as (() => Promise<void>) | undefined;
      await initialFetch?.();

      expect(game.isGameOver.value).toBe(true);
    });

    it("should not mark the game as over when the initial fetch returns questions.", async() => {
      const fetchedQuestions = [createFakeQuestion()];
      fetchAndAppendRandomQuestions.mockImplementation(async() => new Promise<void>(resolve => {
        questions.value = fetchedQuestions;
        resolve();
      }));
      const initialFetch = vi.mocked(callOnce).mock.calls[0]?.[0] as (() => Promise<void>) | undefined;
      await initialFetch?.();

      expect(game.isGameOver.value).toBe(false);
    });
  });

  describe("advanceToNextQuestion", () => {
    it("should increment currentIndex when the game is not over.", async() => {
      const fakeQuestions = Array.from({ length: 10 }, () => createFakeQuestion());
      questions.value = fakeQuestions;
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(fakeQuestions[1]);
    });

    it("should not increment currentIndex when the game is over.", async() => {
      const fakeQuestions = Array.from({ length: 10 }, () => createFakeQuestion());
      const appendedQuestions = [createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
      questions.value = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 10; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      game.advanceToNextQuestion();
      await nextTick();
      questions.value = [...fakeQuestions, ...appendedQuestions];
      await nextTick();

      expect(game.currentQuestion.value).toStrictEqual(appendedQuestions[0]);
    });
  });

  describe("prefetch", () => {
    it("should trigger a prefetch with the excluded ids when currentIndex reaches the threshold.", async() => {
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      questions.value = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        "limit": GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY.limit,
        "excluded-ids": fakeQuestions.slice(0, 20).map(question => question.id).join(","),
      });
    });

    it("should not trigger a prefetch when currentIndex is below the threshold.", async() => {
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      questions.value = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 5; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a prefetch when a fetch is pending.", async() => {
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      questions.value = fakeQuestions;
      isPending.value = true;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(fetchAndAppendRandomQuestions).not.toHaveBeenCalled();
    });

    it("should not trigger a second prefetch when the first prefetch is still in flight.", async() => {
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      let resolvePendingFetch: (() => void) | undefined;
      fetchAndAppendRandomQuestions.mockImplementation(async() => new Promise<void>(resolve => {
        resolvePendingFetch = resolve;
      }));
      questions.value = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      questions.value = [...fakeQuestions, ...Array.from({ length: 25 }, () => createFakeQuestion())];
      await nextTick();
      for (let index = 20; index < 40; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      resolvePendingFetch?.();
      await flushPromises();

      expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        "limit": GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY.limit,
        "excluded-ids": fakeQuestions.slice(0, 20).map(question => question.id).join(","),
      });
    });

    it("should mark the game as over when a prefetch returns no new questions.", async() => {
      questions.value = [createFakeQuestion()];
      await nextTick();
      game.advanceToNextQuestion();
      await nextTick();
      await flushPromises();

      expect(game.isGameOver.value).toBe(true);
    });

    it("should re-arm the prefetch when the pending fetch completes.", async() => {
      const fakeQuestions = Array.from({ length: 25 }, () => createFakeQuestion());
      let resolvePendingFetch: (() => void) | undefined;
      fetchAndAppendRandomQuestions.mockImplementation(async() => new Promise<void>(resolve => {
        resolvePendingFetch = resolve;
      }));
      questions.value = fakeQuestions;
      await nextTick();
      for (let index = 0; index < 20; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();
      questions.value = [...fakeQuestions, ...Array.from({ length: 25 }, () => createFakeQuestion())];
      await nextTick();
      resolvePendingFetch?.();
      await flushPromises();
      isPending.value = true;
      await nextTick();
      isPending.value = false;
      await nextTick();
      fetchAndAppendRandomQuestions.mockClear();
      for (let index = 20; index < 41; index++) {
        game.advanceToNextQuestion();
      }
      await nextTick();
      await flushPromises();

      expect(fetchAndAppendRandomQuestions).toHaveBeenCalledExactlyOnceWith({
        "limit": GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY.limit,
        "excluded-ids": questions.value.slice(0, 41).map(question => question.id).join(","),
      });
    });
  });
});