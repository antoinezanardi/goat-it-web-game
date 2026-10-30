import type { Breadcrumb, ErrorEvent } from "@sentry/core";
import { describe, expect, it } from "vitest";

import { scrubSentryBreadcrumb, scrubSentryEvent } from "#shared/utils/helpers/sentry/scrubbing/scrub-sentry-data.helpers";

function createErrorEvent(event: Partial<ErrorEvent> = {}): ErrorEvent {
  return { type: undefined, ...event };
}

describe(scrubSentryEvent, () => {
  it("should keep useful error context while removing identity and extras when the event is unexpected.", () => {
    const event = createErrorEvent({
      message: "GET https://goat-it.fr/api?secret=1",
      logentry: { message: "raw request content" },
      exception: {
        values: [
          {
            type: "TypeError",
            value: "Cannot read properties of undefined",
            mechanism: { handled: false, type: "auto.function.nuxt.nitro" },
            stacktrace: { frames: [{ filename: "app.js" }] },
          },
        ],
      },
      request: { url: "https://goat-it.fr/game?secret=1" },
      user: { id: "user-1" },
      extra: { gameKey: "secret" },
      contexts: { nuxt: { method: "GET", path: "/game" } },
      breadcrumbs: [{ category: "fetch", data: { url: "https://goat-it.fr/api" } }],
      level: "error",
    });

    const scrubbedEvent = scrubSentryEvent(event);

    expect(scrubbedEvent).toStrictEqual({
      type: undefined,
      message: "GET https://goat-it.fr/api",
      logentry: { message: "raw request content" },
      exception: {
        values: [
          {
            type: "TypeError",
            value: "Cannot read properties of undefined",
            mechanism: { handled: false, type: "auto.function.nuxt.nitro" },
            stacktrace: { frames: [{ filename: "app.js" }] },
          },
        ],
      },
      request: { url: "https://goat-it.fr/game" },
      contexts: { nuxt: { method: "GET", path: "/game" } },
      breadcrumbs: [{ category: "fetch", data: { url: "https://goat-it.fr/api" } }],
      level: "error",
    });
  });

  it("should strip query strings from the logentry and exception values when they contain urls.", () => {
    const event = createErrorEvent({
      logentry: { message: "Retry https://api.goat-it.fr/questions?limit=10" },
      exception: {
        values: [
          { type: "FetchError", value: "[GET] \"https://api.goat-it.fr/questions?limit=10&token=secret\": 500" },
          { type: "Error" },
        ],
      },
    });

    const scrubbedEvent = scrubSentryEvent(event);

    expect(scrubbedEvent).toStrictEqual({
      type: undefined,
      logentry: { message: "Retry https://api.goat-it.fr/questions" },
      exception: {
        values: [
          { type: "FetchError", value: "[GET] \"https://api.goat-it.fr/questions\": 500" },
          { type: "Error" },
        ],
      },
    });
  });

  it("should strip every url query string from a message when the message contains several urls.", () => {
    const scrubbedEvent = scrubSentryEvent(createErrorEvent({ message: "GET https://a.example.com/x?a=1 then https://b.example.com/y?b=2" }));

    expect(scrubbedEvent?.message).toBe("GET https://a.example.com/x then https://b.example.com/y");
  });

  it("should keep the transaction and text fields when they contain no query string.", () => {
    const event = createErrorEvent({
      transaction: "GET /game",
      message: "GET https://goat-it.fr/api",
      logentry: { message: "raw request content" },
      exception: { values: [{ type: "TypeError", value: "Cannot read properties of undefined" }] },
    });

    expect(scrubSentryEvent(event)).toStrictEqual(event);
  });

  it("should strip the query string from the transaction when the transaction contains one.", () => {
    const scrubbedEvent = scrubSentryEvent(createErrorEvent({ transaction: "GET /game?secret=1" }));

    expect(scrubbedEvent?.transaction).toBe("GET /game");
  });

  it("should keep the transaction when the transaction is not a string.", () => {
    const scrubbedEvent = scrubSentryEvent(createErrorEvent());

    expect(scrubbedEvent).not.toHaveProperty("transaction");
  });

  it.each<{ description: string; event: ErrorEvent; originalException: unknown; expectedTags: ErrorEvent["tags"] }>([
    {
      description: "an error with a code",
      event: createErrorEvent({ tags: { existing: "x" } }),
      originalException: { code: "ECONNRESET" },
      expectedTags: { existing: "x", errorCode: "ECONNRESET" },
    },
    {
      description: "an error without a code",
      event: createErrorEvent(),
      originalException: new Error("boom"),
      expectedTags: undefined,
    },
    {
      description: "an error with a non-string code",
      event: createErrorEvent(),
      originalException: { code: 42 },
      expectedTags: undefined,
    },
    {
      description: "a non-record original exception",
      event: createErrorEvent(),
      originalException: "boom",
      expectedTags: undefined,
    },
  ])("should keep the safe error code when the original exception is $description.", ({ event, originalException, expectedTags }) => {
    const scrubbedEvent = scrubSentryEvent(event, originalException);

    expect(scrubbedEvent?.tags).toStrictEqual(expectedTags);
  });

  it("should return null when the original exception is a client error.", () => {
    expect(scrubSentryEvent(createErrorEvent(), { statusCode: 404 })).toBeNull();
  });

  it("should return null when the original exception is an aborted upstream request.", () => {
    const originalException = { statusCode: 502, cause: Object.assign(new Error("aborted"), { name: "AbortError" }) };

    expect(scrubSentryEvent(createErrorEvent(), originalException)).toBeNull();
  });

  it.each<{ description: string; originalException: unknown }>([
    { description: "a non-abort cause", originalException: { statusCode: 502, cause: new Error("connection reset") } },
    { description: "a non-record cause", originalException: { statusCode: 502, cause: "aborted" } },
    { description: "a record without a cause", originalException: { statusCode: 502 } },
  ])("should keep the event when the original exception has $description.", ({ originalException }) => {
    expect(scrubSentryEvent(createErrorEvent(), originalException)).toStrictEqual(createErrorEvent());
  });

  it("should return null when the event targets a health check path.", () => {
    expect(scrubSentryEvent(createErrorEvent({ request: { url: "https://goat-it.fr/readyz" } }))).toBeNull();
  });

  it("should keep the event when the request url is not parseable.", () => {
    expect(scrubSentryEvent(createErrorEvent({ request: { url: "http://[" } }))).toStrictEqual(createErrorEvent({ request: { url: "http://[" } }));
  });

  it("should keep the event when it has no request.", () => {
    expect(scrubSentryEvent(createErrorEvent())).toStrictEqual(createErrorEvent());
  });
});

describe(scrubSentryBreadcrumb, () => {
  it("should strip the query string from the breadcrumb url when the breadcrumb is kept.", () => {
    const breadcrumb: Breadcrumb = {
      category: "fetch",
      message: "GET",
      data: { url: "https://goat-it.fr/api/questions?limit=10", status: 200 },
    };

    const scrubbedBreadcrumb = scrubSentryBreadcrumb(breadcrumb);

    expect(scrubbedBreadcrumb).toStrictEqual({
      category: "fetch",
      message: "GET",
      data: { url: "https://goat-it.fr/api/questions", status: 200 },
    });
  });

  it("should return null when the breadcrumb targets a health check path.", () => {
    expect(scrubSentryBreadcrumb({ category: "fetch", data: { url: "https://goat-it.fr/healthz" } })).toBeNull();
  });

  it("should keep the breadcrumb when it has no data.", () => {
    expect(scrubSentryBreadcrumb({ category: "ui", message: "click" })).toStrictEqual({ category: "ui", message: "click" });
  });

  it("should keep the breadcrumb when its data has no url.", () => {
    expect(scrubSentryBreadcrumb({ category: "ui", data: { status: 200 } })).toStrictEqual({ category: "ui", data: { status: 200 } });
  });
});