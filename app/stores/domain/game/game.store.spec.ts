import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import { createFakeFindRandomQuestionsBodyDto } from "@goat-it/schemas/testing/question";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS } from "#shared/constants/goat-it-api.constants";
import type { AsyncActionContext, UseAsyncAction, UseAsyncActionOptions } from "@/composables/core/useAsyncAction/use-async-action.types";
import type { useGameStore as UseGameStoreType } from "@/stores/domain/game/game.store";

type CapturedRandomAction = (context: AsyncActionContext, body?: FindRandomQuestionsBodyDto) => Promise<Question[]>;

type CapturedByIdsAction = (context: AsyncActionContext, ids: string[]) => Promise<Question[]>;

let randomAsyncActionMock: UseAsyncActionMock;
let byIdsAsyncActionMock: UseAsyncActionMock;
let capturedRandomAction: CapturedRandomAction | undefined;
let capturedRandomOptions: UseAsyncActionOptions | undefined;
let capturedByIdsAction: CapturedByIdsAction | undefined;
let capturedByIdsOptions: UseAsyncActionOptions | undefined;
let useAsyncActionCallCount: number;
let isUsingRealAsyncAction: boolean;

mockNuxtImport("useFetchStatus", (original: typeof useFetchStatus) => original);

mockNuxtImport("useAsyncAction", (original: typeof useAsyncAction) => {
  const realUseAsyncAction = original as unknown as (...arguments_: unknown[]) => UseAsyncAction<unknown, unknown[]>;

  return ((...arguments_: unknown[]): UseAsyncActionMock | UseAsyncAction<unknown, unknown[]> => {
    if (isUsingRealAsyncAction) {
      return realUseAsyncAction(...arguments_);
    }
    useAsyncActionCallCount++;
    if (useAsyncActionCallCount === 1) {
      capturedRandomAction = arguments_[0] as CapturedRandomAction;
      capturedRandomOptions = arguments_[1] as UseAsyncActionOptions | undefined;
      randomAsyncActionMock = createUseAsyncActionMock();

      return randomAsyncActionMock;
    }
    capturedByIdsAction = arguments_[0] as CapturedByIdsAction;
    capturedByIdsOptions = arguments_[1] as UseAsyncActionOptions | undefined;
    byIdsAsyncActionMock = createUseAsyncActionMock();

    return byIdsAsyncActionMock;
  }) as unknown as typeof useAsyncAction;
});

let useGameStore: typeof UseGameStoreType;

describe("useGameStore", () => {
  beforeEach(async() => {
    useAsyncActionCallCount = 0;
    isUsingRealAsyncAction = false;
    capturedRandomAction = undefined;
    capturedRandomOptions = undefined;
    capturedByIdsAction = undefined;
    capturedByIdsOptions = undefined;
    ({ useGameStore } = await import("@/stores/domain/game/game.store"));
  });

  afterEach(() => {
    vi.useRealTimers();
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

    it("should append only the questions whose id is not already stored when the batch repeats known ids.", async() => {
      const knownQuestion = createFakeQuestion();
      const unseenQuestion = createFakeQuestion();
      const store = useGameStore();
      store.questions = [knownQuestion];
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [knownQuestion, unseenQuestion] });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([knownQuestion, unseenQuestion]);
    });

    it("should keep the stored question objects and order when the batch repeats known ids.", async() => {
      const firstKnown = createFakeQuestion();
      const secondKnown = createFakeQuestion();
      const repeatedFirst = createFakeQuestion({ id: firstKnown.id });
      const store = useGameStore();
      store.questions = [firstKnown, secondKnown];
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [repeatedFirst] });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([firstKnown, secondKnown]);
    });

    it("should keep only the first occurrence when a batch repeats an id.", async() => {
      const firstOccurrence = createFakeQuestion();
      const repeatedOccurrence = createFakeQuestion({ id: firstOccurrence.id });
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [firstOccurrence, repeatedOccurrence] });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([firstOccurrence]);
    });

    it("should return the appended questions as value when the batch contains known ids.", async() => {
      const knownQuestion = createFakeQuestion();
      const unseenQuestion = createFakeQuestion();
      const store = useGameStore();
      store.questions = [knownQuestion];
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [knownQuestion, unseenQuestion] });

      const result = await store.fetchAndAppendRandomQuestions();

      expect(result).toStrictEqual({ ok: true, value: [unseenQuestion] });
    });

    it("should return an empty value when every returned question is already stored.", async() => {
      const knownQuestion = createFakeQuestion();
      const store = useGameStore();
      store.questions = [knownQuestion];
      randomAsyncActionMock.execute.mockResolvedValue({ ok: true, value: [knownQuestion] });

      const result = await store.fetchAndAppendRandomQuestions();

      expect(result).toStrictEqual({ ok: true, value: [] });
    });

    it("should return the superseded result unchanged when the fetch is superseded.", async() => {
      const store = useGameStore();
      randomAsyncActionMock.execute.mockResolvedValue({ ok: false, superseded: true });

      const result = await store.fetchAndAppendRandomQuestions();

      expect(result).toStrictEqual({ ok: false, superseded: true });
    });

    it("should not append questions when the fetch is superseded.", async() => {
      const existingQuestion = createFakeQuestion();
      const store = useGameStore();
      store.questions = [existingQuestion];
      randomAsyncActionMock.execute.mockResolvedValue({ ok: false, superseded: true });

      await store.fetchAndAppendRandomQuestions();

      expect(store.questions).toStrictEqual([existingQuestion]);
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
    it("should forward the signal to the repository getRandom when the first captured action is invoked.", async() => {
      useGameStore();
      const signal = new AbortController().signal;
      const body = createFakeFindRandomQuestionsBodyDto({ limit: 20 });

      await capturedRandomAction?.({ signal }, body);

      expect(questionsRepository($fetch).getRandom).toHaveBeenCalledExactlyOnceWith(body, { signal });
    });

    it("should forward the signal to the repository getByIds when the second captured action is invoked.", async() => {
      useGameStore();
      const signal = new AbortController().signal;
      const ids = ["507f1f77bcf86cd799439011"];

      await capturedByIdsAction?.({ signal }, ids);

      expect(questionsRepository($fetch).getByIds).toHaveBeenCalledExactlyOnceWith(ids, { signal });
    });

    it("should pass the client timeout option to the random-questions useAsyncAction when created.", () => {
      useGameStore();

      expect(capturedRandomOptions).toStrictEqual({ timeoutInMs: GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS });
    });

    it("should pass the client timeout option to the by-ids useAsyncAction when created.", () => {
      useGameStore();

      expect(capturedByIdsOptions).toStrictEqual({ timeoutInMs: GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS });
    });
  });

  describe("with the real useAsyncAction", () => {
    beforeEach(() => {
      isUsingRealAsyncAction = true;
      vi.mocked(questionsRepository($fetch).getRandom).mockResolvedValue([]);
      vi.mocked(questionsRepository($fetch).getByIds).mockResolvedValue([]);
    });

    it("should abort the first request signal when a second fetch starts.", async() => {
      const firstResponse = Promise.withResolvers<Question[]>();
      vi.mocked(questionsRepository($fetch).getRandom).mockReturnValueOnce(firstResponse.promise);
      const store = useGameStore();

      const firstFetch = store.fetchAndAppendRandomQuestions();
      const secondFetch = store.fetchAndAppendRandomQuestions();
      const firstSignal = vi.mocked(questionsRepository($fetch).getRandom).mock.calls[0]?.[1]?.signal;

      expect((firstSignal?.reason as DOMException | undefined)?.name).toBe("AbortError");

      firstResponse.resolve([]);
      await firstFetch;
      await secondFetch;
    });

    it("should append only the latest batch when the older response arrives last.", async() => {
      const olderResponse = Promise.withResolvers<Question[]>();
      const newerQuestions = [createFakeQuestion()];
      vi.mocked(questionsRepository($fetch).getRandom).mockReturnValueOnce(olderResponse.promise).mockResolvedValueOnce(newerQuestions);
      const store = useGameStore();

      const olderFetch = store.fetchAndAppendRandomQuestions();
      await store.fetchAndAppendRandomQuestions();
      olderResponse.resolve([createFakeQuestion()]);
      await olderFetch;

      expect(store.questions).toStrictEqual(newerQuestions);
    });

    it("should append only the latest batch when the older response arrives first.", async() => {
      const olderResponse = Promise.withResolvers<Question[]>();
      const newerResponse = Promise.withResolvers<Question[]>();
      const newerQuestions = [createFakeQuestion()];
      vi.mocked(questionsRepository($fetch).getRandom).mockReturnValueOnce(olderResponse.promise).mockReturnValueOnce(newerResponse.promise);
      const store = useGameStore();

      const olderFetch = store.fetchAndAppendRandomQuestions();
      const newerFetch = store.fetchAndAppendRandomQuestions();
      olderResponse.resolve([createFakeQuestion()]);
      await olderFetch;
      newerResponse.resolve(newerQuestions);
      await newerFetch;

      expect(store.questions).toStrictEqual(newerQuestions);
    });

    it("should stay pending when the older request settles before the latest one.", async() => {
      const olderResponse = Promise.withResolvers<Question[]>();
      const newerResponse = Promise.withResolvers<Question[]>();
      vi.mocked(questionsRepository($fetch).getRandom).mockReturnValueOnce(olderResponse.promise).mockReturnValueOnce(newerResponse.promise);
      const store = useGameStore();

      const olderFetch = store.fetchAndAppendRandomQuestions();
      const newerFetch = store.fetchAndAppendRandomQuestions();
      olderResponse.resolve([]);
      await olderFetch;

      expect(store.isPending).toBe(true);

      newerResponse.resolve([]);
      await newerFetch;
    });

    it("should fail the pending request when the request timeout elapses.", async() => {
      vi.useFakeTimers();
      const abortError = new Error("aborted");
      const store = useGameStore();
      vi.mocked(questionsRepository($fetch).getRandom).mockImplementation(async(_body, options) => {
        const response = Promise.withResolvers<Question[]>();
        options?.signal?.addEventListener("abort", () => {
          response.reject(abortError);
        });

        return response.promise;
      });

      const fetchPromise = store.fetchAndAppendRandomQuestions();
      await vi.advanceTimersByTimeAsync(GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS);

      await expect(fetchPromise).resolves.toStrictEqual({ ok: false, error: abortError });
    });

    it("should stop being pending when the request timeout elapses.", async() => {
      vi.useFakeTimers();
      const store = useGameStore();
      vi.mocked(questionsRepository($fetch).getRandom).mockImplementation(async(_body, options) => {
        const response = Promise.withResolvers<Question[]>();
        options?.signal?.addEventListener("abort", () => {
          response.reject(new Error("aborted"));
        });

        return response.promise;
      });

      const fetchPromise = store.fetchAndAppendRandomQuestions();
      await vi.advanceTimersByTimeAsync(GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS);
      await fetchPromise;

      expect(store.isPending).toBe(false);
    });
  });
});