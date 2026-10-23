import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import { createFakeFindQuestionThemesQueryDto } from "@goat-it/schemas/testing/question-theme";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS } from "#shared/constants/goat-it-api.constants";
import type { AsyncActionContext, UseAsyncAction, UseAsyncActionOptions } from "@/composables/core/useAsyncAction/use-async-action.types";
import type { useQuestionThemesStore as UseQuestionThemesStoreType } from "@/stores/domain/question-theme/question-themes.store";

type CapturedAction = (context: AsyncActionContext, query?: FindQuestionThemesQueryDto) => Promise<QuestionTheme[]>;

let fetchAsyncActionMock: UseAsyncActionMock;
let capturedAction: CapturedAction | undefined;
let capturedOptions: UseAsyncActionOptions | undefined;
let isUsingRealAsyncAction: boolean;

mockNuxtImport("useFetchStatus", (original: typeof useFetchStatus) => original);

mockNuxtImport("useAsyncAction", (original: typeof useAsyncAction) => {
  const realUseAsyncAction = original as unknown as (...arguments_: unknown[]) => UseAsyncAction<unknown, unknown[]>;

  return ((...arguments_: unknown[]): UseAsyncActionMock | UseAsyncAction<unknown, unknown[]> => {
    if (isUsingRealAsyncAction) {
      return realUseAsyncAction(...arguments_);
    }
    capturedAction = arguments_[0] as CapturedAction;
    capturedOptions = arguments_[1] as UseAsyncActionOptions | undefined;
    fetchAsyncActionMock = createUseAsyncActionMock();

    return fetchAsyncActionMock;
  }) as unknown as typeof useAsyncAction;
});

let useQuestionThemesStore: typeof UseQuestionThemesStoreType;

describe("useQuestionThemesStore", () => {
  beforeEach(async() => {
    isUsingRealAsyncAction = false;
    capturedAction = undefined;
    capturedOptions = undefined;
    ({ useQuestionThemesStore } = await import("@/stores/domain/question-theme/question-themes.store"));
  });

  describe("questionThemes", () => {
    it("should expose an empty array as initial state when created.", () => {
      const store = useQuestionThemesStore();

      expect(store.questionThemes).toStrictEqual([]);
    });
  });

  describe("activeQuestionThemes", () => {
    it("should expose an empty array when there are no themes.", () => {
      const store = useQuestionThemesStore();

      expect(store.activeQuestionThemes).toStrictEqual([]);
    });

    it("should expose only the active themes when themes have mixed statuses.", () => {
      const store = useQuestionThemesStore();
      const activeTheme = createFakeQuestionTheme({ status: "active" });
      const archivedTheme = createFakeQuestionTheme({ status: "archived" });
      store.questionThemes = [activeTheme, archivedTheme];

      expect(store.activeQuestionThemes).toStrictEqual([activeTheme]);
    });
  });

  describe("activeQuestionThemeIds", () => {
    it("should return only the active theme ids when themes have mixed statuses.", () => {
      const store = useQuestionThemesStore();
      store.questionThemes = [
        createFakeQuestionTheme({ id: "active-1", status: "active" }),
        createFakeQuestionTheme({ id: "archived-1", status: "archived" }),
        createFakeQuestionTheme({ id: "active-2", status: "active" }),
      ];

      expect(store.activeQuestionThemeIds).toStrictEqual(["active-1", "active-2"]);
    });
  });

  describe("isThemesCatalogAvailable", () => {
    it("should be false when there are no active themes.", () => {
      const store = useQuestionThemesStore();
      store.questionThemes = [createFakeQuestionTheme({ status: "archived" })];

      expect(store.isThemesCatalogAvailable).toBe(false);
    });

    it("should be true when there is at least one active theme.", () => {
      const store = useQuestionThemesStore();
      store.questionThemes = [createFakeQuestionTheme({ status: "active" })];

      expect(store.isThemesCatalogAvailable).toBe(true);
    });
  });

  describe("catalogStatus", () => {
    it.each<{ status: "idle" | "pending" | "success" | "error"; activeThemesCount: number; expected: string }>([
      { status: "success", activeThemesCount: 1, expected: "ready" },
      { status: "pending", activeThemesCount: 1, expected: "refreshing" },
      { status: "error", activeThemesCount: 1, expected: "stale" },
      { status: "idle", activeThemesCount: 0, expected: "loading" },
      { status: "pending", activeThemesCount: 0, expected: "loading" },
      { status: "success", activeThemesCount: 0, expected: "unavailable" },
      { status: "error", activeThemesCount: 0, expected: "unavailable" },
    ])("should be $expected when fetchStatus is $status and there are $activeThemesCount active themes.", ({ status, activeThemesCount, expected }) => {
      const store = useQuestionThemesStore();
      store.questionThemes = Array.from({ length: activeThemesCount }, () => createFakeQuestionTheme({ status: "active" }));
      fetchAsyncActionMock.fetchStatus.value = status;

      expect(store.catalogStatus).toBe(expected);
    });
  });

  describe("fetchStatus", () => {
    it("should reflect the fetchStatus value from useAsyncAction when created.", () => {
      const store = useQuestionThemesStore();

      expect(store.fetchStatus).toBe(fetchAsyncActionMock.fetchStatus.value);
    });

    it("should update when the fetchStatus changes to pending.", () => {
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.fetchStatus.value = "pending";

      expect(store.fetchStatus).toBe("pending");
    });
  });

  describe("isPending", () => {
    it.each<{ fetchStatus: "idle" | "pending"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "pending", expected: true },
    ])("should be $expected when fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isPending).toBe(expected);
    });
  });

  describe("isSuccess", () => {
    it.each<{ fetchStatus: "idle" | "success"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "success", expected: true },
    ])("should be $expected when fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isSuccess).toBe(expected);
    });
  });

  describe("isError", () => {
    it.each<{ fetchStatus: "idle" | "error"; expected: boolean }>([
      { fetchStatus: "idle", expected: false },
      { fetchStatus: "error", expected: true },
    ])("should be $expected when fetchStatus is $fetchStatus.", ({ fetchStatus, expected }) => {
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.fetchStatus.value = fetchStatus;

      expect(store.isError).toBe(expected);
    });
  });

  describe("fetchQuestionThemes", () => {
    it("should call the execute function from useAsyncAction when invoked.", async() => {
      const store = useQuestionThemesStore();

      await store.fetchQuestionThemes();

      expect(fetchAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("fetchAndStoreQuestionThemes", () => {
    it("should call fetchQuestionThemes without query when called without params.", async() => {
      const store = useQuestionThemesStore();

      await store.fetchAndStoreQuestionThemes();

      expect(fetchAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(undefined);
    });

    it("should call fetchQuestionThemes with query when called with query params.", async() => {
      const store = useQuestionThemesStore();
      const query = createFakeFindQuestionThemesQueryDto({
        "sort-by": "slug",
        "sort-order": "asc",
        "limit": 10,
      });

      await store.fetchAndStoreQuestionThemes(query);

      expect(fetchAsyncActionMock.execute).toHaveBeenCalledExactlyOnceWith(query);
    });

    it("should update questionThemes with the fetched themes when fetchQuestionThemes resolves with data.", async() => {
      const fakeQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.execute.mockResolvedValue({ ok: true, value: fakeQuestionThemes });

      await store.fetchAndStoreQuestionThemes();

      expect(store.questionThemes).toStrictEqual(fakeQuestionThemes);
    });

    it("should return the success result when fetchQuestionThemes resolves.", async() => {
      const fakeQuestionThemes = [createFakeQuestionTheme()];
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.execute.mockResolvedValue({ ok: true, value: fakeQuestionThemes });

      const result = await store.fetchAndStoreQuestionThemes();

      expect(result).toStrictEqual({ ok: true, value: fakeQuestionThemes });
    });

    it("should return the failure result when fetchQuestionThemes fails.", async() => {
      const store = useQuestionThemesStore();
      const error = new Error("fetch failed");
      fetchAsyncActionMock.execute.mockResolvedValue({ ok: false, error });

      const result = await store.fetchAndStoreQuestionThemes();

      expect(result).toStrictEqual({ ok: false, error });
    });

    it("should not update questionThemes when fetchQuestionThemes fails.", async() => {
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.execute.mockResolvedValue({ ok: false, error: new Error("fetch failed") });

      await store.fetchAndStoreQuestionThemes();

      expect(store.questionThemes).toStrictEqual([]);
    });

    it("should return the superseded result unchanged when the fetch is superseded.", async() => {
      const store = useQuestionThemesStore();
      fetchAsyncActionMock.execute.mockResolvedValue({ ok: false, superseded: true });

      const result = await store.fetchAndStoreQuestionThemes();

      expect(result).toStrictEqual({ ok: false, superseded: true });
    });

    it("should not update questionThemes when the fetch is superseded.", async() => {
      const existingThemes = [createFakeQuestionTheme()];
      const store = useQuestionThemesStore();
      store.questionThemes = existingThemes;
      fetchAsyncActionMock.execute.mockResolvedValue({ ok: false, superseded: true });

      await store.fetchAndStoreQuestionThemes();

      expect(store.questionThemes).toStrictEqual(existingThemes);
    });
  });

  describe("useAsyncAction setup", () => {
    it("should forward the signal to the repository getAll when the captured action is invoked.", async() => {
      useQuestionThemesStore();
      const signal = new AbortController().signal;
      const query = createFakeFindQuestionThemesQueryDto({ limit: 10 });

      await capturedAction?.({ signal }, query);

      expect(questionThemesRepository($fetch).getAll).toHaveBeenCalledExactlyOnceWith(query, { signal });
    });

    it("should pass the client timeout option to useAsyncAction when created.", () => {
      useQuestionThemesStore();

      expect(capturedOptions).toStrictEqual({ timeoutInMs: GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS });
    });
  });

  describe("with the real useAsyncAction", () => {
    beforeEach(() => {
      isUsingRealAsyncAction = true;
      vi.mocked(questionThemesRepository($fetch).getAll).mockResolvedValue([]);
    });

    it("should keep the latest catalog when the older response arrives last.", async() => {
      const olderResponse = Promise.withResolvers<QuestionTheme[]>();
      const newerResponse = Promise.withResolvers<QuestionTheme[]>();
      const newerThemes = [createFakeQuestionTheme()];
      vi.mocked(questionThemesRepository($fetch).getAll).mockReturnValueOnce(olderResponse.promise).mockReturnValueOnce(newerResponse.promise);
      const store = useQuestionThemesStore();

      const olderFetch = store.fetchAndStoreQuestionThemes();
      const newerFetch = store.fetchAndStoreQuestionThemes();
      newerResponse.resolve(newerThemes);
      await newerFetch;
      olderResponse.resolve([createFakeQuestionTheme()]);
      await olderFetch;

      expect(store.questionThemes).toStrictEqual(newerThemes);
    });

    it("should keep the latest catalog when the older response arrives first.", async() => {
      const olderResponse = Promise.withResolvers<QuestionTheme[]>();
      const newerResponse = Promise.withResolvers<QuestionTheme[]>();
      const newerThemes = [createFakeQuestionTheme()];
      vi.mocked(questionThemesRepository($fetch).getAll).mockReturnValueOnce(olderResponse.promise).mockReturnValueOnce(newerResponse.promise);
      const store = useQuestionThemesStore();

      const olderFetch = store.fetchAndStoreQuestionThemes();
      const newerFetch = store.fetchAndStoreQuestionThemes();
      olderResponse.resolve([createFakeQuestionTheme()]);
      await olderFetch;
      newerResponse.resolve(newerThemes);
      await newerFetch;

      expect(store.questionThemes).toStrictEqual(newerThemes);
    });

    it("should keep the catalog refreshing when the older request settles before the latest one.", async() => {
      const olderResponse = Promise.withResolvers<QuestionTheme[]>();
      const newerResponse = Promise.withResolvers<QuestionTheme[]>();
      vi.mocked(questionThemesRepository($fetch).getAll).mockReturnValueOnce(olderResponse.promise).mockReturnValueOnce(newerResponse.promise);
      const store = useQuestionThemesStore();
      store.questionThemes = [createFakeQuestionTheme({ status: "active" })];

      const olderFetch = store.fetchAndStoreQuestionThemes();
      const newerFetch = store.fetchAndStoreQuestionThemes();
      olderResponse.resolve([createFakeQuestionTheme()]);
      await olderFetch;

      expect(store.catalogStatus).toBe("refreshing");

      newerResponse.resolve([createFakeQuestionTheme()]);
      await newerFetch;
    });

    it("should keep the previous catalog and report it stale when the latest request fails.", async() => {
      const existingThemes = [createFakeQuestionTheme({ status: "active" })];
      const store = useQuestionThemesStore();
      store.questionThemes = existingThemes;
      vi.mocked(questionThemesRepository($fetch).getAll).mockRejectedValue(new Error("fetch failed"));

      await store.fetchAndStoreQuestionThemes();

      expect({ questionThemes: store.questionThemes, catalogStatus: store.catalogStatus }).toStrictEqual({ questionThemes: existingThemes, catalogStatus: "stale" });
    });
  });
});