import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FetchError } from "ofetch";

import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import { createUseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";

import type { useGoatItApiErrorToast as UseGoatItApiErrorToastType, extractErrorCode as ExtractErrorCodeType } from "~/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast";

type ExtractErrorCodeUndefinedCase = {
  condition: string;
  createError: () => unknown;
};

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
let extractErrorCode: typeof ExtractErrorCodeType;

describe("useGoatItApiErrorToast", () => {
  beforeEach(async() => {
    useAppToastMock = createUseAppToastMock();
    useI18nMock = createUseI18nMock();
    ({ useGoatItApiErrorToast, extractErrorCode } = await import("~/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast"));
  });

  describe("extractErrorCode", () => {
    it("should return the error code when error is a FetchError with a valid string errorCode.", () => {
      const fetchError = new FetchError("Conflict");
      fetchError.data = { data: { errorCode: "someErrorCode" } };

      expect(extractErrorCode(fetchError)).toBe("someErrorCode");
    });

    it.each<ExtractErrorCodeUndefinedCase>([
      {
        condition: "error is not a FetchError",
        createError: (): unknown => ({ data: { data: { errorCode: "shouldNotBeExtracted" } } }),
      },
      {
        condition: "error is a FetchError with no data",
        createError: (): FetchError => new FetchError("Server Error"),
      },
      {
        condition: "error is a FetchError with non-object nested data",
        createError: (): FetchError => {
          const fetchError = new FetchError("Server Error");
          fetchError.data = { data: "not-an-object" };

          return fetchError;
        },
      },
      {
        condition: "error is a FetchError with null nested data",
        createError: (): FetchError => {
          const fetchError = new FetchError("Server Error");
          fetchError.data = { data: null };

          return fetchError;
        },
      },
      {
        condition: "error is a FetchError with non-string errorCode",
        createError: (): FetchError => {
          const fetchError = new FetchError("Server Error");
          fetchError.data = { data: { errorCode: 123 } };

          return fetchError;
        },
      },
      {
        condition: "error is a FetchError with no errorCode property",
        createError: (): FetchError => {
          const fetchError = new FetchError("Server Error");
          fetchError.data = { data: {} };

          return fetchError;
        },
      },
    ])("should return undefined when $condition.", ({ createError }) => {
      expect(extractErrorCode(createError())).toBeUndefined();
    });
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

      handleGoatItApiError(fetchError, "Can't archive question theme");

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

      handleGoatItApiError(fetchError, "Can't archive question theme");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't archive question theme",
        description: "translated:errors.goatItApi.questionThemeReferencedByLiveQuestions",
        id: "api-error-questionThemeReferencedByLiveQuestions",
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

      handleGoatItApiError(fetchError, "Can't archive question theme");

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
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(createError(), title);

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title,
        description: "translated:errors.unknown",
        id: "api-error-unknown",
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

      handleGoatItApiError(fetchError, "Can't fetch question themes");

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

      handleGoatItApiError(createError(), title);

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });
  });
});