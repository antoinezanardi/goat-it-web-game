import { EventEmitter } from "node:events";

import { getCookie, getValidatedQuery, readValidatedBody } from "h3";
import { ZodError, z } from "zod";
import { QUESTION_DTO } from "@goat-it/schemas/question";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";
import { createFakeQuestionDto } from "@goat-it/schemas/testing/question";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { createQuestionFromQuestionDto } from "#server/utils/goat-it-api/mappers/question/question.mappers";
import {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
  parseAndMapGoatItApiResponse,
  stripUnrecognizedKeys,
  validateGoatItApiBody,
  validateGoatItApiQuery,
} from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import type { CreateGoatItApiEndpointOptions } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";

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
    {
      description: "an id option with query characters",
      resourceName: GoatItApiResourceNames.QUESTION_THEMES,
      options: { id: "abc?x=1" },
      expectedEndpoint: "/question-themes/abc%3Fx%3D1",
    },
    { description: "an id option with a space", resourceName: GoatItApiResourceNames.QUESTION_THEMES, options: { id: "abc def" }, expectedEndpoint: "/question-themes/abc%20def" },
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

type FakeResponse = EventEmitter & { writableEnded: boolean };

function createEventWithResponse(writableEnded = false): { event: H3Event; response: FakeResponse } {
  const response = Object.assign(new EventEmitter(), { writableEnded });
  const event = {
    context: { params: {} },
    path: "/",
    method: "GET",
    node: { res: response },
  } as unknown as H3Event;

  return { event, response };
}

describe(createGoatItApiFetchOptions, () => {
  beforeEach(() => mockGoatItApiEnvironment());

  it("should create fetch options with baseURL, api key and the cookie locale accept-language header when called with event.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");
    const { event } = createEventWithResponse();

    const fetchOptions = createGoatItApiFetchOptions(event);

    expect(fetchOptions).toMatchObject({
      baseURL: "https://api.example.com",
      headers: {
        "goat-it-api-key": "secret-game-key",
        "Accept-Language": "fr",
      },
      redirect: "error",
      retry: 2,
      retryDelay: 300,
    });
  });

  it("should not set the timeout option when called.", () => {
    const { event } = createEventWithResponse();

    const fetchOptions = createGoatItApiFetchOptions(event);

    expect(fetchOptions).not.toHaveProperty("timeout");
  });

  it("should compose an abort signal on the fetch options when called.", () => {
    const { event } = createEventWithResponse();

    const fetchOptions = createGoatItApiFetchOptions(event);

    expect(fetchOptions?.signal).toBeInstanceOf(AbortSignal);
  });

  it.each<{ description: string; options?: { method: "GET" | "POST" }; expectedRetry: number }>([
    { description: "no explicit method", options: undefined, expectedRetry: 2 },
    { description: "the get method", options: { method: "GET" }, expectedRetry: 2 },
    { description: "the post method", options: { method: "POST" }, expectedRetry: 0 },
  ])("should set retry to $expectedRetry when the options carry $description.", ({ options, expectedRetry }) => {
    const { event } = createEventWithResponse();

    const fetchOptions = createGoatItApiFetchOptions(event, options);

    expect(fetchOptions?.retry).toBe(expectedRetry);
  });

  it("should abort the fetch signal when the client disconnects before the response is sent.", () => {
    const { event, response } = createEventWithResponse(false);
    const fetchOptions = createGoatItApiFetchOptions(event);

    response.emit("close");

    expect(fetchOptions?.signal?.aborted).toBe(true);
  });

  it("should not abort the fetch signal when the response has already been sent.", () => {
    const { event, response } = createEventWithResponse(true);
    const fetchOptions = createGoatItApiFetchOptions(event);
    response.emit("close");

    expect(fetchOptions?.signal?.aborted).toBe(false);
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

  it("should return the mapped domain objects when an additive upstream field is present.", () => {
    const fakeQuestionDto = createFakeQuestionDto();
    const rawData = [{ ...fakeQuestionDto, additiveField: "value" }];

    const questions = parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual([createQuestionFromQuestionDto(fakeQuestionDto)]);
  });

  it("should return the mapped domain objects when an additive nested upstream field is present.", () => {
    const fakeQuestionDto = createFakeQuestionDto();
    const rawData = [{ ...fakeQuestionDto, author: { ...fakeQuestionDto.author, additiveField: "value" } }];

    const questions = parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(questions).toStrictEqual([createQuestionFromQuestionDto(fakeQuestionDto)]);
  });

  it("should log the stripped paths when an additive upstream field is present.", () => {
    const consoleSpy = vi.spyOn(console, "error").mockReturnValue();
    const rawData = [{ ...createFakeQuestionDto(), additiveField: "value" }];

    parseAndMapGoatItApiResponse(rawData, QUESTION_DTO, createQuestionFromQuestionDto);

    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(expect.stringContaining("additiveField"));
  });

  it("should throw a zod error when an additive field is present alongside an invalid field.", () => {
    const invalidQuestionDto = { ...createFakeQuestionDto(), id: "invalid-id", additiveField: "value" };

    expect(() => parseAndMapGoatItApiResponse([invalidQuestionDto], QUESTION_DTO, createQuestionFromQuestionDto)).toThrow(ZodError);
  });

  it("should throw a zod error when the raw data is not an array.", () => {
    expect(() => parseAndMapGoatItApiResponse({ id: "invalid-id" }, QUESTION_DTO, createQuestionFromQuestionDto)).toThrow(ZodError);
  });
});

describe(stripUnrecognizedKeys, () => {
  function createUnrecognizedKeysIssue(path: PropertyKey[], keys: string[]): z.core.$ZodIssueUnrecognizedKeys {
    return { code: "unrecognized_keys", keys, path, message: "Unrecognized key" };
  }

  it("should remove the reported keys from the matching nested containers when called.", () => {
    const rawData = [{ id: "abc", author: { name: "x", extra: "y" } }];

    const strippedData = stripUnrecognizedKeys(rawData, [createUnrecognizedKeysIssue([0, "author"], ["extra"])]);

    expect(strippedData).toStrictEqual([{ id: "abc", author: { name: "x" } }]);
  });

  it("should leave the data untouched when the reported path does not resolve to a container.", () => {
    const rawData = { author: "not-an-object" };

    const strippedData = stripUnrecognizedKeys(rawData, [createUnrecognizedKeysIssue(["author", "deeper"], ["extra"])]);

    expect(strippedData).toStrictEqual({ author: "not-an-object" });
  });
});

describe(validateGoatItApiQuery, () => {
  const querySchema = z.strictObject({ limit: z.number() });

  beforeEach(() => mockGoatItApiEnvironment());

  it("should read the query through the h3 validated query helper when called.", async() => {
    vi.mocked(getValidatedQuery).mockResolvedValue({ limit: 5 });

    await validateGoatItApiQuery(mockedEvent, querySchema);

    expect(getValidatedQuery).toHaveBeenCalledExactlyOnceWith(mockedEvent, expect.any(Function));
  });

  it("should return the schema parsed query when the query is valid.", async() => {
    vi.mocked(getValidatedQuery).mockImplementation(async(_event, validate) => {
      const parsedQuery = await validate({ limit: 5 });

      return parsedQuery;
    });

    const query = await validateGoatItApiQuery(mockedEvent, querySchema);

    expect(query).toStrictEqual({ limit: 5 });
  });

  it("should reject with a bad request error carrying the invalid request code when the query is invalid.", async() => {
    vi.mocked(getValidatedQuery).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

    await expect(validateGoatItApiQuery(mockedEvent, querySchema)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
      data: { errorCode: "invalid-request" },
    });
  });

  it("should rethrow the original error when the h3 validated query helper rejects with a non validation error.", async() => {
    const originalError = new Error("boom");
    vi.mocked(getValidatedQuery).mockRejectedValue(originalError);

    await expect(validateGoatItApiQuery(mockedEvent, querySchema)).rejects.toThrow(originalError);
  });
});

describe(validateGoatItApiBody, () => {
  const bodySchema = z.strictObject({ limit: z.number() });

  beforeEach(() => mockGoatItApiEnvironment());

  it("should read the body through the h3 validated body helper when called.", async() => {
    vi.mocked(readValidatedBody).mockResolvedValue({ limit: 5 });

    await validateGoatItApiBody(mockedEvent, bodySchema);

    expect(readValidatedBody).toHaveBeenCalledExactlyOnceWith(mockedEvent, expect.any(Function));
  });

  it("should return the schema parsed body when the body is valid.", async() => {
    vi.mocked(readValidatedBody).mockImplementation(async(_event, validate) => {
      const parsedBody = await validate({ limit: 5 });

      return parsedBody;
    });

    const body = await validateGoatItApiBody(mockedEvent, bodySchema);

    expect(body).toStrictEqual({ limit: 5 });
  });

  it("should reject with a bad request error carrying the invalid request code when the body is invalid.", async() => {
    vi.mocked(readValidatedBody).mockRejectedValue(Object.assign(new Error("Validation Error"), { statusCode: HttpStatusCode.BAD_REQUEST }));

    await expect(validateGoatItApiBody(mockedEvent, bodySchema)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
      data: { errorCode: "invalid-request" },
    });
  });

  it("should rethrow the original error when the h3 validated body helper rejects with a non validation error.", async() => {
    const originalError = new Error("boom");
    vi.mocked(readValidatedBody).mockRejectedValue(originalError);

    await expect(validateGoatItApiBody(mockedEvent, bodySchema)).rejects.toThrow(originalError);
  });
});