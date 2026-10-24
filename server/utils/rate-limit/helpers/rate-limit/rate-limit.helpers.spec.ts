import { beforeEach, describe, expect, it, vi } from "vitest";
import { getRequestHeader } from "h3";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { buildRateLimitKey, createFixedWindowRateLimiter, getSharedRateLimiter } from "#server/utils/rate-limit/helpers/rate-limit/rate-limit.helpers";

vi.stubGlobal("getRequestIP", vi.fn());

const PRUNE_THRESHOLD = 10_000;

describe(createFixedWindowRateLimiter, () => {
  it("should not limit the first request of a window when called.", () => {
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 2, windowInMs: 1000, now: () => 0 });

    const result = limiter.check("client");

    expect(result).toStrictEqual({ isLimited: false, retryAfterInSeconds: 0 });
  });

  it("should not limit the request equal to the maximum when called.", () => {
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 2, windowInMs: 1000, now: () => 0 });
    limiter.check("client");

    const result = limiter.check("client");

    expect(result.isLimited).toBe(false);
  });

  it("should limit the request above the maximum when called.", () => {
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 1, windowInMs: 1000, now: () => 0 });
    limiter.check("client");

    const result = limiter.check("client");

    expect(result.isLimited).toBe(true);
  });

  it("should report the retry delay in seconds when the request is limited.", () => {
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 0, windowInMs: 5000, now: () => 0 });
    limiter.check("client");

    const result = limiter.check("client");

    expect(result.retryAfterInSeconds).toBe(5);
  });

  it("should round the retry delay up when the window remainder is not a whole second.", () => {
    const nowMock = vi.fn<() => number>().mockReturnValue(0);
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 0, windowInMs: 1500, now: nowMock });
    limiter.check("client");
    nowMock.mockReturnValue(1000);

    const result = limiter.check("client");

    expect(result.retryAfterInSeconds).toBe(1);
  });

  it("should reset the window when the window duration has elapsed.", () => {
    const nowMock = vi.fn<() => number>().mockReturnValue(0);
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 0, windowInMs: 1000, now: nowMock });
    limiter.check("client");
    nowMock.mockReturnValue(1000);

    const result = limiter.check("client");

    expect(result.isLimited).toBe(false);
  });

  it("should track clients independently when called with distinct keys.", () => {
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 0, windowInMs: 1000, now: () => 0 });
    limiter.check("first-client");
    limiter.check("second-client");

    const result = limiter.check("third-client");

    expect(result.isLimited).toBe(false);
  });

  it("should fall back to the system clock when no clock is injected.", () => {
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 1, windowInMs: 60_000 });

    const result = limiter.check("client");

    expect(result.isLimited).toBe(false);
  });

  it("should prune expired windows when the tracked window count exceeds the pruning threshold.", () => {
    const nowMock = vi.fn<() => number>().mockReturnValue(0);
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 0, windowInMs: 1000, now: nowMock });
    for (let index = 0; index <= PRUNE_THRESHOLD; index++) {
      limiter.check(`client-${index}`);
    }
    nowMock.mockReturnValue(1000);

    const result = limiter.check("client-0");

    expect(result.isLimited).toBe(false);
  });

  it("should keep the active windows when the tracked window count exceeds the pruning threshold.", () => {
    const nowMock = vi.fn<() => number>().mockReturnValue(0);
    const limiter = createFixedWindowRateLimiter({ maximumRequests: 0, windowInMs: 1000, now: nowMock });
    for (let index = 0; index <= PRUNE_THRESHOLD; index++) {
      limiter.check(`client-${index}`);
    }
    nowMock.mockReturnValue(500);

    const result = limiter.check("client-0");

    expect(result.isLimited).toBe(true);
  });
});

describe(buildRateLimitKey, () => {
  const mockedEvent = createFakeH3Event();

  beforeEach(() => {
    vi.mocked(getRequestIP).mockReturnValue(undefined);
    vi.mocked(getRequestHeader).mockReturnValue(undefined);
  });

  it("should read the forwarded client ip when the trusted proxy flag is enabled.", () => {
    buildRateLimitKey(mockedEvent, true);

    expect(getRequestIP).toHaveBeenCalledExactlyOnceWith(mockedEvent, { xForwardedFor: true });
  });

  it("should read the connection client ip when the trusted proxy flag is disabled.", () => {
    buildRateLimitKey(mockedEvent, false);

    expect(getRequestIP).toHaveBeenCalledExactlyOnceWith(mockedEvent);
  });

  it("should return the client ip when the connection ip is available.", () => {
    vi.mocked(getRequestIP).mockReturnValue("203.0.113.7");

    const key = buildRateLimitKey(mockedEvent, false);

    expect(key).toBe("203.0.113.7");
  });

  it("should ignore the forwarded header when the connection ip cannot be resolved and the trusted proxy flag is disabled.", () => {
    vi.mocked(getRequestHeader).mockReturnValue("203.0.113.9, 10.0.0.1");

    const key = buildRateLimitKey(mockedEvent, false);

    expect(key).toBeUndefined();
  });

  it("should return the first forwarded client ip when the connection ip cannot be resolved and the trusted proxy flag is enabled.", () => {
    vi.mocked(getRequestHeader).mockReturnValue("203.0.113.9, 10.0.0.1");

    const key = buildRateLimitKey(mockedEvent, true);

    expect(key).toBe("203.0.113.9");
  });

  it("should return undefined when the connection ip cannot be resolved, the trusted proxy flag is enabled and the forwarded header is missing.", () => {
    const key = buildRateLimitKey(mockedEvent, true);

    expect(key).toBeUndefined();
  });

  it("should return undefined when the connection ip cannot be resolved, the trusted proxy flag is enabled and the forwarded header is empty.", () => {
    vi.mocked(getRequestHeader).mockReturnValue("");

    const key = buildRateLimitKey(mockedEvent, true);

    expect(key).toBeUndefined();
  });
});

describe(getSharedRateLimiter, () => {
  let getFreshSharedRateLimiter: typeof getSharedRateLimiter;

  beforeEach(async() => {
    vi.resetModules();
    ({ getSharedRateLimiter: getFreshSharedRateLimiter } = await import("#server/utils/rate-limit/helpers/rate-limit/rate-limit.helpers"));
  });

  it("should create the limiter with the configured budget when called for the first time.", () => {
    const limiter = getFreshSharedRateLimiter({ maximumRequests: 1, windowInMs: 1000, trustProxy: false });
    limiter.check("first-client");

    const result = limiter.check("first-client");

    expect(result.isLimited).toBe(true);
  });

  it("should return the same limiter instance when called more than once.", () => {
    const firstLimiter = getFreshSharedRateLimiter({ maximumRequests: 60, windowInMs: 60_000, trustProxy: false });

    const secondLimiter = getFreshSharedRateLimiter({ maximumRequests: 60, windowInMs: 60_000, trustProxy: false });

    expect(secondLimiter).toBe(firstLimiter);
  });
});