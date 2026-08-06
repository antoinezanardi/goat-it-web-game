import { FetchError } from "ofetch";
import { H3Error, getCookie, getRequestHeader } from "h3";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
  handleGoatItApiError,
} from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";

vi.stubGlobal("useRuntimeConfig", vi.fn());

function getThrowableError(function_: () => void): H3Error {
  try {
    function_();
  } catch(error: unknown) {
    return error as H3Error;
  }

  throw new Error("Expected function to throw");
}

describe("Goat It API Helpers", () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    const runtimeConfigMock = {
      goatItApi: {
        baseUrl: "https://api.example.com",
        gameKey: "secret-game-key",
      },
      public: {
        defaultLocale: "en",
        i18n: {
          defaultLocale: "en",
          baseUrl: "",
          locales: [],
          detectBrowserLanguage: {
            alwaysRedirect: false,
            cookieKey: "i18n_redirected",
            cookieSecure: false,
            fallbackLocale: "",
            redirectOn: "root",
            useCookie: true,
          },
        },
      },
    } as const;
    vi.mocked(useRuntimeConfig).mockReturnValue(runtimeConfigMock as unknown as ReturnType<typeof useRuntimeConfig>);
    vi.mocked(getCookie).mockReturnValue(undefined);
    vi.mocked(getRequestHeader).mockReturnValue(undefined);
  });

  describe(createGoatItApiEndpoint, () => {
    it("should create the correct endpoint for a given resource name when called.", () => {
      const resourceName = "question-themes";
      const expectedEndpoint = "/question-themes";
      const endpoint = createGoatItApiEndpoint(resourceName);

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint with id for a given resource name when called.", () => {
      const resourceName = "question-themes";
      const id = "abc123";
      const expectedEndpoint = "/question-themes/abc123";
      const endpoint = createGoatItApiEndpoint(resourceName, { id });

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint with suffix for a given resource name when called.", () => {
      const resourceName = "questions";
      const suffix = "search/random";
      const expectedEndpoint = "/questions/search/random";
      const endpoint = createGoatItApiEndpoint(resourceName, { suffix });

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint without id when empty string id is provided.", () => {
      const resourceName = "question-themes";
      const expectedEndpoint = "/question-themes";
      const endpoint = createGoatItApiEndpoint(resourceName, { id: "" });

      expect(endpoint).toBe(expectedEndpoint);
    });

    it("should create the correct endpoint without suffix when empty string suffix is provided.", () => {
      const resourceName = "questions";
      const expectedEndpoint = "/questions";
      const endpoint = createGoatItApiEndpoint(resourceName, { suffix: "" });

      expect(endpoint).toBe(expectedEndpoint);
    });
  });

  describe(extractLocaleFromEvent, () => {
    it("should return cookie locale when i18n_redirected cookie is valid.", () => {
      vi.mocked(getCookie).mockReturnValue("fr");

      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe("fr");
    });

    it.each([
      { header: "fr-FR,en;q=0.8", expected: "fr" },
      { header: "pt", expected: "pt" },
      { header: "en;q=0.9,fr;q=0.8", expected: "en" },
      { header: "ja-JP", expected: "en" },
      { header: "*", expected: "en" },
    ])("should return '$expected' when accept-language header is '$header' and cookie is missing.", ({ header, expected }) => {
      vi.mocked(getRequestHeader).mockReturnValue(header);

      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe(expected);
    });

    it("should fall back to default locale when cookie and header are missing.", () => {
      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe("en");
    });

    it("should fall back to header locale when cookie locale is unsupported.", () => {
      vi.mocked(getCookie).mockReturnValue("ja");
      vi.mocked(getRequestHeader).mockReturnValue("es-ES");

      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe("es");
    });

    it("should prefer cookie locale over accept-language header when both are present.", () => {
      vi.mocked(getCookie).mockReturnValue("de");
      vi.mocked(getRequestHeader).mockReturnValue("fr-FR");

      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe("de");
    });

    it("should fall back to default locale when i18n_redirected cookie is empty string.", () => {
      vi.mocked(getCookie).mockReturnValue("");

      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe("en");
    });

    it("should fall back to the first valid locale when default locale is invalid.", () => {
      vi.mocked(useRuntimeConfig).mockReturnValue({
        goatItApi: {
          baseUrl: "https://api.example.com",
          gameKey: "secret-game-key",
        },
        public: {
          defaultLocale: "invalid-locale",
        },
      } as unknown as ReturnType<typeof useRuntimeConfig>);

      const locale = extractLocaleFromEvent(mockedEvent);

      expect(locale).toBe("en");
    });
  });

  describe(createGoatItApiFetchOptions, () => {
    it("should create fetch options with baseURL, api key and accept-language header when called with event.", () => {
      vi.mocked(getRequestHeader).mockReturnValue("fr-FR");
      const expectedFetchOptions: Parameters<typeof $fetch>[1] = {
        baseURL: "https://api.example.com",
        headers: {
          "goat-it-api-key": "secret-game-key",
          "Accept-Language": "fr",
        },
      };

      const fetchOptions = createGoatItApiFetchOptions(mockedEvent);

      expect(fetchOptions).toStrictEqual<Parameters<typeof $fetch>[1]>(expectedFetchOptions);
    });
  });

  describe(handleGoatItApiError, () => {
    describe("when error is a FetchError with valid ApiResponseExceptionDto data", () => {
      it("should throw H3Error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow(H3Error);
      });

      it("should throw H3Error with status code from the parsed API error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.statusCode).toBe(409);
      });

      it("should throw H3Error with message from the parsed API error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow("Question theme is referenced by live questions");
      });

      it("should throw H3Error with error code in data from the parsed API error when called.", () => {
        const fetchError = new FetchError("Conflict");
        fetchError.data = {
          statusCode: 409,
          message: "Question theme is referenced by live questions",
          error: "Conflict",
          errorCode: "questionThemeReferencedByLiveQuestions",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.data).toStrictEqual({ errorCode: "questionThemeReferencedByLiveQuestions" });
      });
    });

    describe("when error is a FetchError with valid ApiResponseExceptionDto data but no errorCode", () => {
      it("should throw H3Error when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow(H3Error);
      });

      it("should throw H3Error with status code from the parsed API error when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.statusCode).toBe(400);
      });

      it("should throw H3Error with message from the parsed API error when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };

        expect(() => handleGoatItApiError(fetchError)).toThrow("The request could not be understood");
      });

      it("should throw H3Error with undefined error code in data when called.", () => {
        const fetchError = new FetchError("Bad Request");
        fetchError.data = {
          statusCode: 400,
          message: "The request could not be understood",
          error: "Bad Request",
        };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.data).toStrictEqual({ errorCode: undefined });
      });
    });

    describe("when error is a FetchError with invalid data that does not match ApiResponseExceptionDto", () => {
      it("should throw H3Error when called.", () => {
        const fetchError = new FetchError("Unknown error");
        fetchError.data = { unexpected: "shape" };

        expect(() => handleGoatItApiError(fetchError)).toThrow(H3Error);
      });

      it("should throw H3Error with 500 status code when called.", () => {
        const fetchError = new FetchError("Unknown error");
        fetchError.data = { unexpected: "shape" };
        const error = getThrowableError(() => handleGoatItApiError(fetchError));

        expect(error.statusCode).toBe(500);
      });

      it("should throw H3Error with internal server error message when called.", () => {
        const fetchError = new FetchError("Unknown error");
        fetchError.data = { unexpected: "shape" };

        expect(() => handleGoatItApiError(fetchError)).toThrow("Internal server error");
      });
    });

    it("should re-throw the original error when error is not a FetchError.", () => {
      const originalError = new Error("Some other error");

      expect(() => handleGoatItApiError(originalError)).toThrow(originalError);
    });
  });
});