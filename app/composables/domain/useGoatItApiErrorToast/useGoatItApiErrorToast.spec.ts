import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FetchError } from "ofetch";

import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import { createUseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";

import type { useGoatItApiErrorToast as UseGoatItApiErrorToastType } from "@/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast";

type GenericFallbackCase = {
  condition: string;
  createError: () => Error;
  title: string;
};

let useAppToastMock: UseAppToastMock;
let useI18nMock: UseI18nMock;

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);
mockNuxtImport("useI18n", () => (): UseI18nMock => useI18nMock);

let useGoatItApiErrorToast: typeof UseGoatItApiErrorToastType;

describe("useGoatItApiErrorToast", () => {
  beforeEach(async() => {
    useAppToastMock = createUseAppToastMock();
    useI18nMock = createUseI18nMock();
    ({ useGoatItApiErrorToast } = await import("@/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast"));
  });

  describe("handleGoatItApiError", () => {
    it("should check if translation exists for the error code key when error is a FetchError with an errorCode.", () => {
      vi.mocked(useI18nMock.te).mockReturnValue(true);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Conflict");
      fetchError.data = {
        data: { errorCode: "questionThemeReferencedByLiveQuestions" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't archive question theme", "questions");

      expect(useI18nMock.te).toHaveBeenCalledExactlyOnceWith("errors.goatItApi.questionThemeReferencedByLiveQuestions");
    });

    it("should call addErrorToast with title and translated error code description when error is a FetchError with a known errorCode.", () => {
      vi.mocked(useI18nMock.te).mockReturnValue(true);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Conflict");
      fetchError.data = {
        data: { errorCode: "questionThemeReferencedByLiveQuestions" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't archive question theme", "questions");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't archive question theme",
        description: "translated:errors.goatItApi.questionThemeReferencedByLiveQuestions",
        id: "questions-api-error-questionThemeReferencedByLiveQuestions",
      });
    });

    it("should not log error when error is a FetchError with a known errorCode.", () => {
      vi.mocked(useI18nMock.te).mockReturnValue(true);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();
      const fetchError = new FetchError("Conflict");
      fetchError.data = {
        data: { errorCode: "questionThemeReferencedByLiveQuestions" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't archive question theme", "questions");

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it.each<GenericFallbackCase>([
      {
        condition: "error is a FetchError with an unknown errorCode",
        createError: (): FetchError => {
          const fetchError = new FetchError("Conflict");
          fetchError.data = {
            data: { errorCode: "unknownErrorCode" },
          };

          return fetchError;
        },
        title: "Can't fetch question themes",
      },
      {
        condition: "error is a FetchError with no errorCode",
        createError: (): FetchError => {
          const fetchError = new FetchError("Bad Request");
          fetchError.data = {
            data: {},
          };

          return fetchError;
        },
        title: "Can't create question theme",
      },
      {
        condition: "error is a FetchError with empty string errorCode",
        createError: (): FetchError => {
          const fetchError = new FetchError("Bad Request");
          fetchError.data = {
            data: { errorCode: "" },
          };

          return fetchError;
        },
        title: "Can't create question theme",
      },
      {
        condition: "error is a FetchError with non-object nested data",
        createError: (): FetchError => {
          const fetchError = new FetchError("Server Error");
          fetchError.data = { data: "not-an-object" };

          return fetchError;
        },
        title: "Can't fetch question themes",
      },
      {
        condition: "error is a FetchError with no data",
        createError: (): FetchError => new FetchError("Server Error"),
        title: "Can't fetch question themes",
      },
      {
        condition: "error is not a FetchError",
        createError: (): Error => new Error("Something broke"),
        title: "Can't fetch question themes",
      },
    ])("should call addErrorToast with generic fallback description when $condition.", ({ createError, title }) => {
      vi.mocked(useI18nMock.te).mockReturnValue(false);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      vi.spyOn(console, "error").mockReturnValue();
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(createError(), title, "questions");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title,
        description: "translated:errors.unknown",
        id: "questions-api-error-unknown",
      });
    });

    it("should log error when error is a FetchError with an unknown errorCode.", () => {
      vi.mocked(useI18nMock.te).mockReturnValue(false);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();
      const fetchError = new FetchError("Conflict");
      fetchError.data = {
        data: { errorCode: "unknownErrorCode" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes", "questions");

      expect(consoleSpy).toHaveBeenCalledExactlyOnceWith("Unknown Goat It API error code: unknownErrorCode");
    });

    it.each<GenericFallbackCase>([
      {
        condition: "error is a FetchError with no errorCode",
        createError: (): FetchError => {
          const fetchError = new FetchError("Bad Request");
          fetchError.data = {
            data: {},
          };

          return fetchError;
        },
        title: "Can't create question theme",
      },
      {
        condition: "error is a FetchError with empty string errorCode",
        createError: (): FetchError => {
          const fetchError = new FetchError("Bad Request");
          fetchError.data = {
            data: { errorCode: "" },
          };

          return fetchError;
        },
        title: "Can't create question theme",
      },
      {
        condition: "error is a FetchError with non-object nested data",
        createError: (): FetchError => {
          const fetchError = new FetchError("Server Error");
          fetchError.data = { data: "not-an-object" };

          return fetchError;
        },
        title: "Can't fetch question themes",
      },
      {
        condition: "error is a FetchError with no data",
        createError: (): FetchError => new FetchError("Server Error"),
        title: "Can't fetch question themes",
      },
      {
        condition: "error is not a FetchError",
        createError: (): Error => new Error("Something broke"),
        title: "Can't fetch question themes",
      },
    ])("should not check translation key when $condition.", ({ createError, title }) => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(createError(), title, "questions");

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });

    it.each<{ statusCode: number; expectedErrorCode: string }>([
      { statusCode: 400, expectedErrorCode: "invalid-request" },
      { statusCode: 429, expectedErrorCode: "rate-limited" },
      { statusCode: 500, expectedErrorCode: "internal-error" },
      { statusCode: 502, expectedErrorCode: "upstream-error" },
      { statusCode: 503, expectedErrorCode: "upstream-error" },
      { statusCode: 504, expectedErrorCode: "upstream-timeout" },
    ])("should call addErrorToast with the $expectedErrorCode message when the error has no error code and status $statusCode.", ({ statusCode, expectedErrorCode }) => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Upstream error");
      fetchError.statusCode = statusCode;
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes", "questions");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
        description: `translated:errors.goatItApi.${expectedErrorCode}`,
        id: `questions-api-error-${expectedErrorCode}`,
      });
    });

    it("should call addErrorToast with the status mapped message when the error has an unknown error code and a known status.", () => {
      vi.mocked(useI18nMock.te).mockReturnValue(false);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      vi.spyOn(console, "error").mockReturnValue();
      const fetchError = new FetchError("Too Many Requests");
      fetchError.data = { data: { errorCode: "custom-upstream-code" } };
      fetchError.statusCode = 429;
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes", "questions");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
        description: "translated:errors.goatItApi.rate-limited",
        id: "questions-api-error-rate-limited",
      });
    });

    it("should call addErrorToast with the generic fallback description when the error has no error code and an unknown status.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Not Found");
      fetchError.statusCode = 404;
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes", "questions");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
        description: "translated:errors.unknown",
        id: "questions-api-error-unknown",
      });
    });

    it("should not log when the error has no error code and a known status.", () => {
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();
      const fetchError = new FetchError("Too Many Requests");
      fetchError.statusCode = 429;
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes", "questions");

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});