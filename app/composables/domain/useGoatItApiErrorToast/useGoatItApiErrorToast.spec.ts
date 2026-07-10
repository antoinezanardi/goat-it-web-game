import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FetchError } from "ofetch";

import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";
import { createUseI18nMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock";

import type { useGoatItApiErrorToast as UseGoatItApiErrorToastType, extractErrorCode as ExtractErrorCodeType } from "~/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast";

let useAppToastMock: UseAppToastMock;
let useI18nMock: UseI18nMock;

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);
mockNuxtImport("useI18n", () => (): UseI18nMock => useI18nMock);

let useGoatItApiErrorToast: typeof UseGoatItApiErrorToastType;
let extractErrorCode: typeof ExtractErrorCodeType;

describe("useGoatItApiErrorToast", () => {
  beforeEach(async() => {
    vi.resetModules();
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

    it("should return undefined when error is not a FetchError.", () => {
      const error = { data: { data: { errorCode: "shouldNotBeExtracted" } } };

      expect(extractErrorCode(error)).toBeUndefined();
    });

    it("should return undefined when error is a FetchError with no data.", () => {
      const fetchError = new FetchError("Server Error");

      expect(extractErrorCode(fetchError)).toBeUndefined();
    });

    it("should return undefined when error is a FetchError with non-object nested data.", () => {
      const fetchError = new FetchError("Server Error");
      fetchError.data = { data: "not-an-object" };

      expect(extractErrorCode(fetchError)).toBeUndefined();
    });

    it("should return undefined when error is a FetchError with null nested data.", () => {
      const fetchError = new FetchError("Server Error");
      fetchError.data = { data: null };

      expect(extractErrorCode(fetchError)).toBeUndefined();
    });

    it("should return undefined when error is a FetchError with non-string errorCode.", () => {
      const fetchError = new FetchError("Server Error");
      fetchError.data = { data: { errorCode: 123 } };

      expect(extractErrorCode(fetchError)).toBeUndefined();
    });

    it("should return undefined when error is a FetchError with no errorCode property.", () => {
      const fetchError = new FetchError("Server Error");
      fetchError.data = { data: {} };

      expect(extractErrorCode(fetchError)).toBeUndefined();
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

    it("should call addErrorToast with generic fallback description when error is a FetchError with an unknown errorCode.", () => {
      vi.mocked(useI18nMock.te).mockReturnValue(false);
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Conflict");
      fetchError.data = {
        data: { errorCode: "unknownErrorCode" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
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

    it("should call addErrorToast with generic fallback description when error is a FetchError with no errorCode.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Bad Request");
      fetchError.data = {
        data: {},
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't create question theme");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't create question theme",
        description: "translated:errors.unknown",
        id: "api-error-unknown",
      });
    });

    it("should not check translation key when error is a FetchError with no errorCode.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Bad Request");
      fetchError.data = {
        data: {},
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't create question theme");

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });

    it("should call addErrorToast with generic fallback description when error is a FetchError with empty string errorCode.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Bad Request");
      fetchError.data = {
        data: { errorCode: "" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't create question theme");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't create question theme",
        description: "translated:errors.unknown",
        id: "api-error-unknown",
      });
    });

    it("should not check translation key when error is a FetchError with empty string errorCode.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Bad Request");
      fetchError.data = {
        data: { errorCode: "" },
      };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't create question theme");

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });

    it("should call addErrorToast with generic fallback description when error is a FetchError with non-object nested data.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Server Error");
      fetchError.data = { data: "not-an-object" };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
        description: "translated:errors.unknown",
        id: "api-error-unknown",
      });
    });

    it("should not check translation key when error is a FetchError with non-object nested data.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Server Error");
      fetchError.data = { data: "not-an-object" };
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes");

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });

    it("should call addErrorToast with generic fallback description when error is a FetchError with no data.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Server Error");
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
        description: "translated:errors.unknown",
        id: "api-error-unknown",
      });
    });

    it("should not check translation key when error is a FetchError with no data.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const fetchError = new FetchError("Server Error");
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(fetchError, "Can't fetch question themes");

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });

    it("should call addErrorToast with generic fallback description when error is not a FetchError.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const genericError = new Error("Something broke");
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(genericError, "Can't fetch question themes");

      expect(useAppToastMock.addErrorToast).toHaveBeenCalledExactlyOnceWith({
        title: "Can't fetch question themes",
        description: "translated:errors.unknown",
        id: "api-error-unknown",
      });
    });

    it("should not check translation key when error is not a FetchError.", () => {
      vi.mocked(useI18nMock.t).mockImplementation((key: string) => `translated:${key}`);
      const genericError = new Error("Something broke");
      const { handleGoatItApiError } = useGoatItApiErrorToast();

      handleGoatItApiError(genericError, "Can't fetch question themes");

      expect(useI18nMock.te).not.toHaveBeenCalled();
    });
  });
});