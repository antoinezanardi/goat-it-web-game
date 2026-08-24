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
import type { CreateGoatItApiEndpointOptions, GoatItApiResourceName } from "#server/utils/goat-it-api/goat-it-api.types";

vi.stubGlobal("useRuntimeConfig", vi.fn());

const mockedEvent = createFakeH3Event();

function mockGoatItApiEnvironment(): void {
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
}

function getThrowableError(function_: () => void): H3Error {
  try {
    function_();
  } catch(error: unknown) {
    return error as H3Error;
  }

  throw new Error("Expected function to throw");
}

describe(createGoatItApiEndpoint, () => {
  beforeEach(mockGoatItApiEnvironment);

  it.each<{
    description: string;
    resourceName: GoatItApiResourceName;
    options?: CreateGoatItApiEndpointOptions;
    expectedEndpoint: string;
  }>([
    { description: "no options", resourceName: "question-themes", expectedEndpoint: "/question-themes" },
    { description: "an id option", resourceName: "question-themes", options: { id: "abc123" }, expectedEndpoint: "/question-themes/abc123" },
    { description: "a suffix option", resourceName: "questions", options: { suffix: "search/random" }, expectedEndpoint: "/questions/search/random" },
    { description: "an empty id option", resourceName: "question-themes", options: { id: "" }, expectedEndpoint: "/question-themes" },
    { description: "an empty suffix option", resourceName: "questions", options: { suffix: "" }, expectedEndpoint: "/questions" },
  ])(
    "should create the endpoint '$expectedEndpoint' for resource '$resourceName' when called with $description.",
    ({ resourceName, options, expectedEndpoint }) => {
      const endpoint = createGoatItApiEndpoint(resourceName, options);

      expect(endpoint).toBe(expectedEndpoint);
    },
  );
});

describe(extractLocaleFromEvent, () => {
  beforeEach(mockGoatItApiEnvironment);

  it("should return cookie locale when i18n_redirected cookie is valid.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");

    const locale = extractLocaleFromEvent(mockedEvent);

    expect(locale).toBe("fr");
  });

  it.each<{ header: string; expected: string }>([
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
  beforeEach(mockGoatItApiEnvironment);

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

type GoatItApiFetchErrorTestCase = {
  description: string;
  errorData: unknown;
  expectedStatusCode: number;
  expectedMessage: string;
};

type GoatItApiErrorCodeDataTestCase = {
  description: string;
  errorData: unknown;
  expectedData: { errorCode?: string };
};

describe(handleGoatItApiError, () => {
  beforeEach(mockGoatItApiEnvironment);

  const validErrorDataWithErrorCode = {
    statusCode: 409,
    message: "Question theme is referenced by live questions",
    error: "Conflict",
    errorCode: "questionThemeReferencedByLiveQuestions",
  };
  const validErrorDataWithoutErrorCode = {
    statusCode: 400,
    message: "The request could not be understood",
    error: "Bad Request",
  };
  const invalidErrorData = { unexpected: "shape" };

  const fetchErrorTestCases: GoatItApiFetchErrorTestCase[] = [
    {
      description: "valid ApiResponseExceptionDto data with errorCode",
      errorData: validErrorDataWithErrorCode,
      expectedStatusCode: 409,
      expectedMessage: "Question theme is referenced by live questions",
    },
    {
      description: "valid ApiResponseExceptionDto data without errorCode",
      errorData: validErrorDataWithoutErrorCode,
      expectedStatusCode: 400,
      expectedMessage: "The request could not be understood",
    },
    {
      description: "invalid data that does not match ApiResponseExceptionDto",
      errorData: invalidErrorData,
      expectedStatusCode: 500,
      expectedMessage: "Internal server error",
    },
  ];

  const errorCodeDataTestCases: GoatItApiErrorCodeDataTestCase[] = [
    {
      description: "valid ApiResponseExceptionDto data with errorCode",
      errorData: validErrorDataWithErrorCode,
      expectedData: { errorCode: "questionThemeReferencedByLiveQuestions" },
    },
    {
      description: "valid ApiResponseExceptionDto data without errorCode",
      errorData: validErrorDataWithoutErrorCode,
      expectedData: { errorCode: undefined },
    },
  ];

  function createFailingFetchError(data: unknown): FetchError {
    const fetchError = new FetchError("Goat It API error");

    fetchError.data = data;

    return fetchError;
  }

  describe("when error is a FetchError", () => {
    it.each(fetchErrorTestCases)(
      "should throw an H3Error when error data is $description.",
      ({ errorData }) => {
        expect(() => handleGoatItApiError(createFailingFetchError(errorData))).toThrow(H3Error);
      },
    );

    it.each(fetchErrorTestCases)(
      "should throw an H3Error with status code $expectedStatusCode when error data is $description.",
      ({ errorData, expectedStatusCode }) => {
        const error = getThrowableError(() => handleGoatItApiError(createFailingFetchError(errorData)));

        expect(error.statusCode).toBe(expectedStatusCode);
      },
    );

    it.each(fetchErrorTestCases)(
      "should throw an H3Error with the message '$expectedMessage' when error data is $description.",
      ({ errorData, expectedMessage }) => {
        const error = getThrowableError(() => handleGoatItApiError(createFailingFetchError(errorData)));

        expect(error.message).toBe(expectedMessage);
      },
    );

    it.each(errorCodeDataTestCases)(
      "should throw an H3Error with the parsed errorCode in data when error data is $description.",
      ({ errorData, expectedData }) => {
        const error = getThrowableError(() => handleGoatItApiError(createFailingFetchError(errorData)));

        expect(error.data).toStrictEqual(expectedData);
      },
    );
  });

  it("should re-throw the original error when error is not a FetchError.", () => {
    const originalError = new Error("Some other error");

    expect(() => handleGoatItApiError(originalError)).toThrow(originalError);
  });
});