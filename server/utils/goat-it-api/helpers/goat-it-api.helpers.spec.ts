import { EventEmitter } from "node:events";

import { getCookie } from "h3";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
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