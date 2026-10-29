import { describe, expect, it } from "vitest";

import { scrubSentryBreadcrumb, scrubSentryEvent } from "#shared/utils/helpers/sentry/scrubbing/scrub-sentry-data.helpers";

describe(scrubSentryEvent, () => {
  it("should remove request user extra contexts breadcrumbs and raw messages when the event is unexpected.", () => {
    const event = {
      message: "GET https://goat-it.fr/api?secret=1",
      logentry: { message: "raw request content" },
      exception: {
        values: [
          {
            type: "TypeError",
            value: "GET https://goat-it.fr/api?secret=1",
            mechanism: { data: { gameKey: "secret" } },
            stacktrace: { frames: [{ filename: "app.js", vars: { gameKey: "secret" } }] },
          },
        ],
      },
      request: {
        url: "https://goat-it.fr/game?secret=1",
        headers: { authorization: "secret" },
        data: { answer: "42" },
      },
      user: { id: "user-1" },
      extra: { gameKey: "secret" },
      contexts: { state: { answer: "42" } },
      breadcrumbs: [{ category: "fetch", data: { url: "https://goat-it.fr/api" } }],
      level: "error",
    };

    scrubSentryEvent(event);

    expect(event).toStrictEqual({
      exception: { values: [{ type: "TypeError", stacktrace: { frames: [{ filename: "app.js" }] } }] },
      level: "error",
    });
  });

  it.each<{ description: string; event: object; expectedEvent: object }>([
    {
      description: "an event without an exception",
      event: { message: "raw", level: "error" },
      expectedEvent: { level: "error" },
    },
    {
      description: "an event with an empty exception",
      event: { exception: {}, level: "error" },
      expectedEvent: { exception: {}, level: "error" },
    },
    {
      description: "an exception values list with a non record value",
      event: { exception: { values: ["boom"] }, level: "error" },
      expectedEvent: { exception: { values: ["boom"] }, level: "error" },
    },
    {
      description: "an exception value without a stacktrace",
      event: { exception: { values: [{ type: "Error", value: "boom" }] }, level: "error" },
      expectedEvent: { exception: { values: [{ type: "Error" }] }, level: "error" },
    },
    {
      description: "a stacktrace without a frames array",
      event: { exception: { values: [{ type: "Error", stacktrace: { frames: "x" } }] }, level: "error" },
      expectedEvent: { exception: { values: [{ type: "Error", stacktrace: { frames: "x" } }] }, level: "error" },
    },
    {
      description: "a frames list with a non record frame",
      event: { exception: { values: [{ type: "Error", stacktrace: { frames: ["x"] } }] }, level: "error" },
      expectedEvent: { exception: { values: [{ type: "Error", stacktrace: { frames: ["x"] } }] }, level: "error" },
    },
    {
      description: "an array event",
      event: [],
      expectedEvent: [],
    },
  ])("should scrub the exception data when the event is $description.", ({ event, expectedEvent }) => {
    scrubSentryEvent(event);

    expect(event).toStrictEqual(expectedEvent);
  });

  it.each<{ description: string; event: object; originalException: unknown; expectedEvent: object }>([
    {
      description: "an error with a code",
      event: { tags: { existing: "x" }, level: "error" },
      originalException: { code: "ECONNRESET" },
      expectedEvent: { tags: { existing: "x", errorCode: "ECONNRESET" }, level: "error" },
    },
    {
      description: "an error without a code",
      event: { level: "error" },
      originalException: new Error("boom"),
      expectedEvent: { level: "error" },
    },
    {
      description: "a non-record tags value",
      event: { tags: "x", level: "error" },
      originalException: { code: "E1" },
      expectedEvent: { tags: { errorCode: "E1" }, level: "error" },
    },
    {
      description: "a non-record original exception",
      event: { level: "error" },
      originalException: "boom",
      expectedEvent: { level: "error" },
    },
  ])("should keep the safe error code when the original exception is $description.", ({ event, originalException, expectedEvent }) => {
    scrubSentryEvent(event, originalException);

    expect(event).toStrictEqual(expectedEvent);
  });

  it("should return null when the original exception is a client error.", () => {
    expect(scrubSentryEvent({ level: "error" }, { statusCode: 404 })).toBeNull();
  });

  it("should return null when the original exception is an aborted upstream request.", () => {
    const originalException = { statusCode: 502, cause: Object.assign(new Error("aborted"), { name: "AbortError" }) };

    expect(scrubSentryEvent({ level: "error" }, originalException)).toBeNull();
  });

  it.each<{ description: string; originalException: unknown }>([
    { description: "a non-abort cause", originalException: { statusCode: 502, cause: new Error("connection reset") } },
    { description: "a non-record cause", originalException: { statusCode: 502, cause: "aborted" } },
    { description: "a record without a cause", originalException: { statusCode: 502 } },
  ])("should keep the event when the original exception has $description.", ({ originalException }) => {
    const event = { level: "error" };

    scrubSentryEvent(event, originalException);

    expect(event).toStrictEqual({ level: "error" });
  });

  it("should return null when the event targets a health check path.", () => {
    expect(scrubSentryEvent({ request: { url: "https://goat-it.fr/readyz" } })).toBeNull();
  });

  it("should keep the event when the request url is not parseable.", () => {
    const event = { request: { url: "http://[" }, level: "error" };

    scrubSentryEvent(event);

    expect(event).toStrictEqual({ level: "error" });
  });

  it("should keep the event when it has no request.", () => {
    const event = { level: "error" };

    scrubSentryEvent(event);

    expect(event).toStrictEqual({ level: "error" });
  });

  it("should keep the event when the request url is not a string.", () => {
    const event = { request: { url: 42 }, level: "error" };

    scrubSentryEvent(event);

    expect(event).toStrictEqual({ level: "error" });
  });
});

describe(scrubSentryBreadcrumb, () => {
  it("should remove the breadcrumb data when the breadcrumb is kept.", () => {
    const breadcrumb = {
      category: "fetch",
      message: "GET",
      data: { url: "https://goat-it.fr/api/questions?limit=10" },
    };

    scrubSentryBreadcrumb(breadcrumb);

    expect(breadcrumb).toStrictEqual({ category: "fetch", message: "GET" });
  });

  it("should return null when the breadcrumb targets a health check path.", () => {
    expect(scrubSentryBreadcrumb({ category: "fetch", data: { url: "https://goat-it.fr/healthz" } })).toBeNull();
  });

  it("should keep the breadcrumb when it has no data.", () => {
    const breadcrumb = { category: "ui", message: "click" };

    scrubSentryBreadcrumb(breadcrumb);

    expect(breadcrumb).toStrictEqual({ category: "ui", message: "click" });
  });

  it("should keep the breadcrumb when it is not a record.", () => {
    const breadcrumb: string[] = [];

    scrubSentryBreadcrumb(breadcrumb);

    expect(breadcrumb).toStrictEqual([]);
  });
});