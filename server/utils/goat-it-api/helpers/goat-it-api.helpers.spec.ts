import { FetchError } from "ofetch";
import { H3Error, getCookie } from "h3";
import { ZodError } from "zod";
import { QUESTION_DTO } from "@goat-it/schemas/question";
import type { Locale } from "@goat-it/schemas/shared/locale";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
  parseAndMapGoatItApiResponse,
  throwGoatItApiError,
} from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import type { CreateGoatItApiEndpointOptions } from "#server/utils/goat-it-api/goat-it-api.types";

vi.stubGlobal("useRuntimeConfig", vi.fn());

const mockedEvent = createFakeH3Event();

function mockGoatItApiEnvironment(defaultLocale: Locale = "en"): void {
  const runtimeConfigMock = {
    goatItApi: {
      baseUrl: "https://api.example.com",
      gameKey: "secret-game-key",
    },
    public: {
      defaultLocale,
    },
  } as const;
  vi.mocked(useRuntimeConfig).mockReturnValue(runtimeConfigMock as unknown as ReturnType<typeof useRuntimeConfig>);
  vi.mocked(getCookie).mockReturnValue(undefined);
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
  beforeEach(() => mockGoatItApiEnvironment());

  it.each<{
    description: string;
    resourceName: GoatItApiResourceNames;
    options?: CreateGoatItApiEndpointOptions;
    expectedEndpoint: string;
  }>([
    { description: "no options", resourceName: GoatItApiResourceNames.QUESTION_THEMES, expectedEndpoint: "/question-themes" },
    { description: "an id option", resourceName: GoatItApiResourceNames.QUESTION_THEMES, options: { id: "abc123" }, expectedEndpoint: "/question-themes/abc123" },
    { description: "a suffix option", resourceName: GoatItApiResourceNames.QUESTIONS, options: { suffix: "search/random" }, expectedEndpoint: "/questions/search/random" },
    { description: "an empty id option", resourceName: GoatItApiResourceNames.QUESTION_THEMES, options: { id: "" }, expectedEndpoint: "/question-themes" },
    { description: "an empty suffix option", resourceName: GoatItApiResourceNames.QUESTIONS, options: { suffix: "" }, expectedEndpoint: "/questions" },
  ])(
    "should create the endpoint '$expectedEndpoint' for resource '$resourceName' when called with $description.",
    ({ resourceName, options, expectedEndpoint }) => {
      const endpoint = createGoatItApiEndpoint(resourceName, options);

      expect(endpoint).toBe(expectedEndpoint);
    },
  );
});

describe(extractLocaleFromEvent, () => {
  beforeEach(() => mockGoatItApiEnvironment());

  it("should return cookie locale when i18n_redirected cookie is valid.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");

    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("fr");
  });

  it.each<{ cookieValue: string; description: string }>([
    { cookieValue: "", description: "an empty string" },
    { cookieValue: "FR", description: "an uppercase locale code" },
    { cookieValue: "ja", description: "an unsupported locale" },
    { cookieValue: "garbage", description: "a garbage value" },
  ])("should fall back to default locale when i18n_redirected cookie is $description.", ({ cookieValue }) => {
    vi.mocked(getCookie).mockReturnValue(cookieValue);

    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("en");
  });

  it("should fall back to default locale when cookie is missing.", () => {
    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("en");
  });

  it("should fall back to the provided default locale when cookie is missing and the default locale is fr.", () => {
    const locale = extractLocaleFromEvent(mockedEvent, "fr");

    expect(locale).toBe("fr");
  });

  it.each<{ cookieValue: string; description: string }>([
    { cookieValue: "", description: "an empty string" },
    { cookieValue: "FR", description: "an uppercase locale code" },
    { cookieValue: "ja", description: "an unsupported locale" },
    { cookieValue: "garbage", description: "a garbage value" },
  ])("should fall back to the provided fr default locale when i18n_redirected cookie is $description.", ({ cookieValue }) => {
    vi.mocked(getCookie).mockReturnValue(cookieValue);

    const locale = extractLocaleFromEvent(mockedEvent, "fr");

    expect(locale).toBe("fr");
  });
});

describe(createGoatItApiFetchOptions, () => {
  beforeEach(() => mockGoatItApiEnvironment());

  it("should create fetch options with baseURL, api key and the cookie locale accept-language header when called with event.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");
    const expectedFetchOptions: Parameters<typeof $fetch>[1] = {
      baseURL: "https://api.example.com",
      headers: {
        "goat-it-api-key": "secret-game-key",
        "Accept-Language": "fr",
      },
      retry: 2,
      retryDelay: 300,
      timeout: 10_000,
    };

    const fetchOptions = createGoatItApiFetchOptions(mockedEvent);

    expect(fetchOptions).toStrictEqual<Parameters<typeof $fetch>[1]>(expectedFetchOptions);
  });

  it("should create fetch options with the default accept-language header when no cookie is present.", () => {
    const expectedFetchOptions: Parameters<typeof $fetch>[1] = {
      baseURL: "https://api.example.com",
      headers: {
        "goat-it-api-key": "secret-game-key",
        "Accept-Language": "en",
      },
      retry: 2,
      retryDelay: 300,
      timeout: 10_000,
    };

    const fetchOptions = createGoatItApiFetchOptions(mockedEvent);

    expect(fetchOptions).toStrictEqual<Parameters<typeof $fetch>[1]>(expectedFetchOptions);
  });

  it("should create fetch options with the configured fr accept-language header when no cookie is present and default locale is fr.", () => {
    mockGoatItApiEnvironment("fr");
    const expectedFetchOptions: Parameters<typeof $fetch>[1] = {
      baseURL: "https://api.example.com",
      headers: {
        "goat-it-api-key": "secret-game-key",
        "Accept-Language": "fr",
      },
      retry: 2,
      retryDelay: 300,
      timeout: 10_000,
    };

    const fetchOptions = createGoatItApiFetchOptions(mockedEvent);

    expect(fetchOptions).toStrictEqual<Parameters<typeof $fetch>[1]>(expectedFetchOptions);
  });
});

describe(throwGoatItApiError, () => {
  beforeEach(() => mockGoatItApiEnvironment());

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

  function createFailingFetchError(data: unknown): FetchError {
    const fetchError = new FetchError("Goat It API error");

    fetchError.data = data;

    return fetchError;
  }

  describe("when error is a FetchError", () => {
    it.each<{
      description: string;
      errorData: unknown;
    }>([
      {
        description: "valid ApiResponseExceptionDto data with errorCode",
        errorData: validErrorDataWithErrorCode,
      },
      {
        description: "valid ApiResponseExceptionDto data without errorCode",
        errorData: validErrorDataWithoutErrorCode,
      },
      {
        description: "invalid data that does not match ApiResponseExceptionDto",
        errorData: invalidErrorData,
      },
    ])(
      "should throw an H3Error when error data is $description.",
      ({ errorData }) => {
        expect(() => throwGoatItApiError(createFailingFetchError(errorData))).toThrow(H3Error);
      },
    );

    it.each<{
      description: string;
      errorData: unknown;
      expectedStatusCode: number;
    }>([
      {
        description: "valid ApiResponseExceptionDto data with errorCode",
        errorData: validErrorDataWithErrorCode,
        expectedStatusCode: 409,
      },
      {
        description: "valid ApiResponseExceptionDto data without errorCode",
        errorData: validErrorDataWithoutErrorCode,
        expectedStatusCode: 400,
      },
      {
        description: "invalid data that does not match ApiResponseExceptionDto",
        errorData: invalidErrorData,
        expectedStatusCode: 500,
      },
    ])(
      "should throw an H3Error with status code $expectedStatusCode when error data is $description.",
      ({ errorData, expectedStatusCode }) => {
        const error = getThrowableError(() => throwGoatItApiError(createFailingFetchError(errorData)));

        expect(error.statusCode).toBe(expectedStatusCode);
      },
    );

    it("should not forward the upstream error message when error data is valid.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createFailingFetchError(validErrorDataWithErrorCode)));

      expect(error.message).not.toBe(validErrorDataWithErrorCode.message);
    });

    it.each<{
      description: string;
      errorData: unknown;
      expectedData: { errorCode?: string };
    }>([
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
      {
        description: "invalid data that does not match ApiResponseExceptionDto",
        errorData: invalidErrorData,
        expectedData: {},
      },
    ])(
      "should throw an H3Error with the parsed errorCode in data when error data is $description.",
      ({ errorData, expectedData }) => {
        const error = getThrowableError(() => throwGoatItApiError(createFailingFetchError(errorData)));

        expect(error.data).toStrictEqual(expectedData);
      },
    );
  });

  it("should re-throw the original error when error is not a FetchError.", () => {
    const originalError = new Error("Some other error");

    expect(() => throwGoatItApiError(originalError)).toThrow(originalError);
  });
});

describe(parseAndMapGoatItApiResponse, () => {
  it("should return the mapped domain objects when the raw data matches the dto schema.", () => {
    const fakeQuestionDtos = [
      createFakeQuestionDto(),
      createFakeQuestionDto(),
      createFakeQuestionDto(),
    ];
    const expectedQuestions = fakeQuestionDtos.map(createQuestionFromQuestionDto);

    const questions = parseAndMapGoatItApiResponse(fakeQuestionDtos, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual(expectedQuestions);
  });

  it("should return an empty array when the raw data is an empty array.", () => {
    const questions = parseAndMapGoatItApiResponse([], QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual([]);
  });

  it("should throw a zod error when the raw data does not match the dto schema.", () => {
    expect(() => parseAndMapGoatItApiResponse([{ id: "invalid-id" }], QUESTION_DTO, createQuestionFromQuestionDto)).toThrow(ZodError);
  });

  it("should throw a zod error when the raw data is not an array.", () => {
    expect(() => parseAndMapGoatItApiResponse({ id: "invalid-id" }, QUESTION_DTO, createQuestionFromQuestionDto)).toThrow(ZodError);
  });
});