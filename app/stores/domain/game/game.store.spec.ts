import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeFindRandomQuestionsBodyDto } from "@goat-it/schemas/testing/question";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { useGameStore as UseGameStoreType } from "@/stores/domain/game/game.store";

let randomAsyncActionMock: UseAsyncActionMock;
let byIdsAsyncActionMock: UseAsyncActionMock;
let capturedRandomAction: ((...arguments_: unknown[]) => Promise<unknown>) | undefined;
let capturedByIdsAction: ((...arguments_: unknown[]) => Promise<unknown>) | undefined;
let capturedRandomOnError: ((error: unknown) => void) | undefined;
let capturedByIdsOnError: ((error: unknown) => void) | undefined;
let useAsyncActionCallCount: number;

mockNuxtImport("useAsyncAction", () => (action: unknown, onError: unknown): UseAsyncActionMock => {
  useAsyncActionCallCount++;
  if (useAsyncActionCallCount === 1) {
    capturedRandomAction = action as (...arguments_: unknown[]) => Promise<unknown>;
    capturedRandomOnError = onError as (error: unknown) => void;
    randomAsyncActionMock = createUseAsyncActionMock();

    return randomAsyncActionMock;
  }
  capturedByIdsAction = action as (...arguments_: unknown[]) => Promise<unknown>;
  capturedByIdsOnError = onError as (error: unknown) => void;
  byIdsAsyncActionMock = createUseAsyncActionMock();

  return byIdsAsyncActionMock;
});

let useGameStore: typeof UseGameStoreType;

describe("useGameStore", () => {
  beforeEach(async() => {
    useAsyncActionCallCount = 0;
    capturedRandomAction = undefined;
    capturedRandomOnError = undefined;
    capturedByIdsAction = undefined;
    capturedByIdsOnError = undefined;
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

  describe("isFetchingQuestionsByIdsSuccess", () => {
    it.each<{ fetchStatus: "idle" | "success"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "success", expected: true },
    ])("should be $expected when by ids fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useGameStore();
      byIdsAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isFetchingQuestionsByIdsSuccess).toBe(expected);
    });
  });

  describe("isFetchingQuestionsByIdsError", () => {
    it.each<{ fetchStatus: "idle" | "error"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "error", expected: true },
    ])("should be $expected when by ids fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useGameStore();
      byIdsAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isFetchingQuestionsByIdsError).toBe(expected);
    });
  });

  describe("fetchRandomQuestions", () => {
    it("should call the execute function from useAsyncAction when invoked.", async() => {
      const store = useGameStore();

      await store.fetchRandomQuestions();

      expect(randomAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith();
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

      await store.fetchAndAppendRandomQuestions();

      expect(randomAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(undefined);
    });

    it("should call fetchRandomQuestions with body when called with body params.", async() => {
      const store = useGameStore();
      const body = createFakeFindRandomQuestionsBodyDto({
        limit: 20,
      });

      await store.fetchAndAppendRandomQuestions(body);

      expect(randomAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(body);
    });

    it("should append fetched questions to questions when fetchRandomQuestions resolves with data.", async() => {
      const fakeQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue(fakeQuestions);

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual(fakeQuestions);
    });

    it("should preserve existing questions when appending a batch.", async() => {
      const initialQuestions = [createFakeQuestion()];
      const appendedQuestions = [createFakeQuestion(), createFakeQuestion()];
      const store = useGameStore();
      store.questions = initialQuestions;
      randomAsyncActionMock.execute.mockResolvedValue(appendedQuestions);

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([...initialQuestions, ...appendedQuestions]);
    });

    it("should not mutate questions when fetchRandomQuestions resolves with undefined.", async() => {
      const store = useGameStore();

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([]);
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

  describe("useAsyncAction setup", () => {
    it("should pass the repository getRandom function as action to the first useAsyncAction when created.", () => {
      useGameStore();

      expect(capturedRandomAction).toBe(questionsRepository($fetch).getRandom);
    });

    it("should pass the repository getByIds function as action to the second useAsyncAction when created.", () => {
      useGameStore();

      expect(capturedByIdsAction).toBe(questionsRepository($fetch).getByIds);
    });

    it("should call handleGoatItApiError with the error and cantFetch translation key when the random fetch error callback is invoked.", () => {
      useGameStore();
      const fakeError = new Error("fetch failed");

      capturedRandomOnError?.(fakeError);

      expect(useGoatItApiErrorToast().handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fakeError, "questions.cantFetch");
    });

    it("should call handleGoatItApiError with the error and cantFetch translation key when the by ids fetch error callback is invoked.", () => {
      useGameStore();
      const fakeError = new Error("fetch failed");

      capturedByIdsOnError?.(fakeError);

      expect(useGoatItApiErrorToast().handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fakeError, "questions.cantFetch");
    });
  });
});