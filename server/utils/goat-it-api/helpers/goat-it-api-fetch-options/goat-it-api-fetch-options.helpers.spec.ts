import { EventEmitter } from "node:events";

import type { H3Event } from "h3";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api-fetch-options/goat-it-api-fetch-options.helpers";
import { extractLocaleFromEvent } from "#server/utils/goat-it-api/helpers/goat-it-api-locale/goat-it-api-locale.helpers";

vi.stubGlobal("useRuntimeConfig", vi.fn());
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api-locale/goat-it-api-locale.helpers"));

function mockGoatItApiEnvironment(): void {
  const runtimeConfigMock = {
    goatItApi: {
      baseUrl: "https://api.example.com",
      gameKey: "secret-game-key",
    },
    public: {
      defaultLocale: "en",
    },
  } as const;
  vi.mocked(useRuntimeConfig).mockReturnValue(runtimeConfigMock as unknown as ReturnType<typeof useRuntimeConfig>);
  vi.mocked(extractLocaleFromEvent).mockReturnValue("en");
}

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

  it("should create fetch options with baseURL, api key and the resolved locale accept-language header when called with event.", () => {
    vi.mocked(extractLocaleFromEvent).mockReturnValue("fr");
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

  it("should resolve the accept-language header from the event and the configured default locale when called.", () => {
    const { event } = createEventWithResponse();

    createGoatItApiFetchOptions(event);

    expect(extractLocaleFromEvent).toHaveBeenCalledExactlyOnceWith(event, "en");
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