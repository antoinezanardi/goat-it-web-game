import { createFakeFindQuestionThemesQueryDto } from "@goat-it/schemas/testing/question-theme";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import type { useQuestionThemesStore as UseQuestionThemesStoreType } from "@/stores/domain/question-theme/question-themes.store";

let fetchAsyncActionMock: UseAsyncActionMock;
let capturedFetchAction: ((...arguments_: unknown[]) => Promise<unknown>) | undefined;
let capturedFetchOnError: ((error: unknown) => void) | undefined;

mockNuxtImport("useAsyncAction", () => (action: unknown, onError: unknown): UseAsyncActionMock => {
  capturedFetchAction = action as (...arguments_: unknown[]) => Promise<unknown>;
  capturedFetchOnError = onError as (error: unknown) => void;
  fetchAsyncActionMock = createUseAsyncActionMock();

  return fetchAsyncActionMock;
});

let useQuestionThemesStore: typeof UseQuestionThemesStoreType;

describe("useQuestionThemesStore", () => {
  beforeEach(async() => {
    capturedFetchAction = undefined;
    capturedFetchOnError = undefined;
    ({ useQuestionThemesStore } = await import("@/stores/domain/question-theme/question-themes.store"));
  });

  describe("questionThemes", () => {
    it("should expose an empty array as initial state when created.", () => {
      const store = useQuestionThemesStore();

      expect(store.questionThemes).toStrictEqual([]);
    });
  });

  describe("questionThemeSlugs", () => {
    it("should return an empty array when there are no question themes.", () => {
      const store = useQuestionThemesStore();

      expect(store.questionThemeSlugs).toStrictEqual<string[]>([]);
    });

    it("should return the slugs of all question themes when there are themes.", () => {
      const store = useQuestionThemesStore();
      const fakeTheme1 = createFakeQuestionTheme({ slug: "theme-one" });
      const fakeTheme2 = createFakeQuestionTheme({ slug: "theme-two" });
      store.questionThemes = [fakeTheme1, fakeTheme2];

      expect(store.questionThemeSlugs).toStrictEqual(["theme-one", "theme-two"]);
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

  describe("catalogStatus", () => {
    it.each<{ status: "idle" | "pending" | "success" | "error"; activeThemesCount: number; expected: string }>([
      { status: "success", activeThemesCount: 1, expected: "ready" },
      { status: "pending", activeThemesCount: 1, expected: "refreshing" },
      { status: "error", activeThemesCount: 1, expected: "stale" },
      { status: "pending", activeThemesCount: 0, expected: "loading" },
      { status: "idle", activeThemesCount: 0, expected: "loading" },
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
      fetchAsyncActionMock.execute.mockResolvedValue(fakeQuestionThemes);

      await store.fetchAndStoreQuestionThemes();

      expect(store.questionThemes).toStrictEqual(fakeQuestionThemes);
    });

    it("should not update questionThemes when fetchQuestionThemes resolves with undefined.", async() => {
      const store = useQuestionThemesStore();

      await store.fetchAndStoreQuestionThemes();

      expect(store.questionThemes).toStrictEqual([]);
    });
  });

  describe("useAsyncAction setup", () => {
    it("should pass the repository getAll function as action to useAsyncAction when created.", () => {
      useQuestionThemesStore();

      expect(capturedFetchAction).toBe(questionThemesRepository($fetch).getAll);
    });

    it("should call handleGoatItApiError with the error and cantFetch translation key when the fetch error callback is invoked.", () => {
      useQuestionThemesStore();
      const fakeError = new Error("fetch failed");

      capturedFetchOnError?.(fakeError);

      expect(useGoatItApiErrorToast().handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fakeError, "questionThemes.cantFetch");
    });
  });
});