import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeFindRandomQuestionsBodyDto } from "@goat-it/schemas/testing/question";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { useGameStore as UseGameStoreType } from "@/stores/domain/game/game.store";

let randomAsyncActionMock: UseAsyncActionMock;
let byIdsAsyncActionMock: UseAsyncActionMock;
let randomActionArguments: unknown[] | undefined;
let byIdsActionArguments: unknown[] | undefined;
let useAsyncActionCallCount: number;

mockNuxtImport("useAsyncAction", () => (...arguments_: unknown[]): UseAsyncActionMock => {
  useAsyncActionCallCount++;
  if (useAsyncActionCallCount === 1) {
    randomActionArguments = arguments_;
    randomAsyncActionMock = createUseAsyncActionMock();

    return randomAsyncActionMock;
  }
  byIdsActionArguments = arguments_;
  byIdsAsyncActionMock = createUseAsyncActionMock();

  return byIdsAsyncActionMock;
});

let useGameStore: typeof UseGameStoreType;

describe("useGameStore", () => {
  beforeEach(async() => {
    useAsyncActionCallCount = 0;
    randomActionArguments = undefined;
    byIdsActionArguments = undefined;
    ({ useGameStore } = await import("@/stores/domain/game/game.store"));
  });

  describe("questions", () => {
    it("should expose an empty array as initial state when created.", () => {
      const store = useGameStore();

      expect(store.questions).toStrictEqual([]);
    });
  });

  describe("fetchStatus", () => {
    it("should reflect the fetchStatus value from useAsyncAction when created.", () => {
      const store = useGameStore();

      expect(store.fetchStatus).toBe(randomAsyncActionMock.fetchStatus.value);
    });

    it("should update when the fetchStatus changes to pending.", () => {
      const store = useGameStore();
      randomAsyncActionMock.fetchStatus.value = "pending";

      expect(store.fetchStatus).toBe("pending");
    });
  });

  describe("isPending", () => {
    it.each<{ fetchStatus: "idle" | "pending"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "pending", expected: true },
    ])("should be $expected when fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useGameStore();
      randomAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isPending).toBe(expected);
    });
  });

  describe("isSuccess", () => {
    it.each<{ fetchStatus: "idle" | "success"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "success", expected: true },
    ])("should be $expected when fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useGameStore();
      randomAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isSuccess).toBe(expected);
    });
  });

  describe("isError", () => {
    it.each<{ fetchStatus: "idle" | "error"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "error", expected: true },
    ])("should be $expected when fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useGameStore();
      randomAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isError).toBe(expected);
    });
  });

  describe("fetchQuestionsByIdsStatus", () => {
    it("should reflect the by ids fetchStatus value from useAsyncAction when created.", () => {
      const store = useGameStore();

      expect(store.fetchQuestionsByIdsStatus).toBe(byIdsAsyncActionMock.fetchStatus.value);
    });

    it("should update when the by ids fetchStatus changes to pending.", () => {
      const store = useGameStore();
      byIdsAsyncActionMock.fetchStatus.value = "pending";

      expect(store.fetchQuestionsByIdsStatus).toBe("pending");
    });
  });

  describe("isFetchingQuestionsByIds", () => {
    it.each<{ fetchStatus: "idle" | "pending"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "pending", expected: true },
    ])("should be $expected when by ids fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useGameStore();
      byIdsAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isFetchingQuestionsByIds).toBe(expected);
    });
  });

  describe("fetchQuestionsByIds", () => {
    it("should call the by ids execute function with the ids when invoked.", async() => {
      const store = useGameStore();
      const ids = ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"];

      await store.fetchQuestionsByIds(ids);

      expect(byIdsAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(ids);
    });
  });

  describe("fetchAndAppendRandomQuestions", () => {
    it("should call fetchRandomQuestions without query when called without params.", async() => {
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [] });

      await store.fetchAndAppendRandomQuestions();

      expect(randomAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(undefined);
    });

    it("should call fetchRandomQuestions with body when called with body params.", async() => {
      const store = useGameStore();
      const body = createFakeFindRandomQuestionsBodyDto({
        limit: 20,
      });
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [] });

      await store.fetchAndAppendRandomQuestions(body);

      expect(randomAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(body);
    });

    it("should append fetched questions to questions when fetchRandomQuestions resolves with data.", async() => {
      const fakeQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: fakeQuestions });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual(fakeQuestions);
    });

    it("should preserve existing questions when appending a batch.", async() => {
      const initialQuestions = [createFakeQuestion()];
      const appendedQuestions = [createFakeQuestion(), createFakeQuestion()];
      const expectedQuestions = [...initialQuestions, ...appendedQuestions];
      const store = useGameStore();
      store.questions = initialQuestions;
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: appendedQuestions });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual(expectedQuestions);
    });

    it("should return the success result when fetchRandomQuestions resolves.", async() => {
      const fakeQuestions = [createFakeQuestion()];
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: fakeQuestions });

      const result = await store.fetchAndAppendRandomQuestions();

      expect(result).toStrictEqual({ ok: true, value: fakeQuestions });
    });

    it("should return the failure result when fetchRandomQuestions fails.", async() => {
      const store = useGameStore();
      const error = new Error("fetch failed");
      randomAsyncActionMock.execute.mockResolvedValue({ ok: false, error });

      const result = await store.fetchAndAppendRandomQuestions();

      expect(result).toStrictEqual({ ok: false, error });
    });

    it("should not append questions when fetchRandomQuestions fails.", async() => {
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([]);
    });
  });

  describe("replaceQuestions", () => {
    it("should replace the questions with the given questions when invoked.", () => {
      const store = useGameStore();
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];

      store.replaceQuestions(fakeQuestions);

      expect(store.questions).toStrictEqual(fakeQuestions);
    });
  });

  describe("resetQuestions", () => {
    it("should clear the questions when invoked.", () => {
      const store = useGameStore();
      store.questions = [createFakeQuestion(), createFakeQuestion()];

      store.resetQuestions();

      expect(store.questions).toStrictEqual([]);
    });

    it("should keep the questions empty when invoked while already empty.", () => {
      const store = useGameStore();

      store.resetQuestions();

      expect(store.questions).toStrictEqual([]);
    });
  });

  describe("truncateQuestions", () => {
    it("should keep only the first questions up to the given length when invoked.", () => {
      const store = useGameStore();
      const fakeQuestions = [createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
      store.questions = fakeQuestions;

      store.truncateQuestions(2);

      expect(store.questions).toStrictEqual(fakeQuestions.slice(0, 2));
    });

    it("should keep all questions when the given length exceeds the questions count.", () => {
      const store = useGameStore();
      const fakeQuestions = [createFakeQuestion()];
      store.questions = fakeQuestions;

      store.truncateQuestions(5);

      expect(store.questions).toStrictEqual(fakeQuestions);
    });
  });

  describe("useAsyncAction setup", () => {
    it("should pass the repository getRandom function as action to the first useAsyncAction when created.", () => {
      useGameStore();

      expect(randomActionArguments).toStrictEqual([questionsRepository($fetch).getRandom]);
    });

    it("should pass the repository getByIds function as action to the second useAsyncAction when created.", () => {
      useGameStore();

      expect(byIdsActionArguments).toStrictEqual([questionsRepository($fetch).getByIds]);
    });
  });
});