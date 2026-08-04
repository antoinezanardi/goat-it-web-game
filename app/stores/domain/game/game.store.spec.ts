import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeFindQuestionsQueryDto } from "@goat-it/schemas/testing/question";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { useGameStore as UseQuestionsStoreType } from "@/stores/domain/game/game.store";

let fetchAsyncActionMock: UseAsyncActionMock;
let capturedFetchAction: ((...arguments_: unknown[]) => Promise<unknown>) | undefined;
let capturedFetchOnError: ((error: unknown) => void) | undefined;

mockNuxtImport("useAsyncAction", () => (action: unknown, onError: unknown): UseAsyncActionMock => {
  capturedFetchAction = action as (...arguments_: unknown[]) => Promise<unknown>;
  capturedFetchOnError = onError as (error: unknown) => void;
  fetchAsyncActionMock = createUseAsyncActionMock();

  return fetchAsyncActionMock;
});

let useGameStore: typeof UseQuestionsStoreType;

describe("useGameStore", () => {
  beforeEach(async() => {
    capturedFetchAction = undefined;
    capturedFetchOnError = undefined;
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

      expect(store.fetchStatus).toBe(fetchAsyncActionMock.fetchStatus.value);
    });

    it("should update when the fetchStatus changes to pending.", () => {
      const store = useGameStore();
      fetchAsyncActionMock.fetchStatus.value = "pending";

      expect(store.fetchStatus).toBe("pending");
    });
  });

  describe("isPending", () => {
    it("should be false when fetchStatus is idle.", () => {
      const store = useGameStore();

      expect(store.isPending).toBeFalsy();
    });

    it("should be true when fetchStatus is pending.", () => {
      const store = useGameStore();
      fetchAsyncActionMock.fetchStatus.value = "pending";

      expect(store.isPending).toBeTruthy();
    });
  });

  describe("isSuccess", () => {
    it("should be false when fetchStatus is idle.", () => {
      const store = useGameStore();

      expect(store.isSuccess).toBeFalsy();
    });

    it("should be true when fetchStatus is success.", () => {
      const store = useGameStore();
      fetchAsyncActionMock.fetchStatus.value = "success";

      expect(store.isSuccess).toBeTruthy();
    });
  });

  describe("isError", () => {
    it("should be false when fetchStatus is idle.", () => {
      const store = useGameStore();

      expect(store.isError).toBeFalsy();
    });

    it("should be true when fetchStatus is error.", () => {
      const store = useGameStore();
      fetchAsyncActionMock.fetchStatus.value = "error";

      expect(store.isError).toBeTruthy();
    });
  });

  describe("fetchRandomQuestions", () => {
    it("should call the execute function from useAsyncAction when invoked.", async() => {
      const store = useGameStore();

      await store.fetchRandomQuestions();

      expect(fetchAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("fetchAndAppendRandomQuestions", () => {
    it("should call fetchRandomQuestions without query when called without params.", async() => {
      const store = useGameStore();

      await store.fetchAndAppendRandomQuestions();

      expect(fetchAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(undefined);
    });

    it("should call fetchRandomQuestions with query when called with query params.", async() => {
      const store = useGameStore();
      const query = createFakeFindQuestionsQueryDto({
        "sort-by": "createdAt",
        "sort-order": "asc",
        "limit": 20,
      });

      await store.fetchAndAppendRandomQuestions(query);

      expect(fetchAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(query);
    });

    it("should append fetched questions to questions when fetchRandomQuestions resolves with data.", async() => {
      const fakeQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      const store = useGameStore();
      fetchAsyncActionMock.execute.mockResolvedValue(fakeQuestions);

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual(fakeQuestions);
    });

    it("should preserve existing questions when appending a batch.", async() => {
      const initialQuestions = [createFakeQuestion()];
      const appendedQuestions = [createFakeQuestion(), createFakeQuestion()];
      const store = useGameStore();
      store.questions = initialQuestions;
      fetchAsyncActionMock.execute.mockResolvedValue(appendedQuestions);

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([...initialQuestions, ...appendedQuestions]);
    });

    it("should not mutate questions when fetchRandomQuestions resolves with undefined.", async() => {
      const store = useGameStore();

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([]);
    });
  });

  describe("useAsyncAction setup", () => {
    it("should pass the repository getRandom function as action to useAsyncAction when created.", () => {
      useGameStore();

      expect(capturedFetchAction).toBe(questionsRepository($fetch).getRandom);
    });

    it("should call handleGoatItApiError with the error and cantFetch translation key when the fetch error callback is invoked.", () => {
      useGameStore();
      const fakeError = new Error("fetch failed");

      capturedFetchOnError?.(fakeError);

      expect(useGoatItApiErrorToast().handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fakeError, "questions.cantFetch");
    });
  });
});