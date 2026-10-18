import { getRequestHeader } from "h3";
import type { H3Event } from "h3";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { MILLISECONDS_IN_SECOND, MINIMUM_RETRY_AFTER_IN_SECONDS, RATE_LIMIT_MAP_PRUNE_THRESHOLD } from "#server/utils/rate-limit/helpers/rate-limit/rate-limit.constants";
import type { CreateFixedWindowRateLimiterOptions, FixedWindowRateLimiter, RateLimitCheckResult, RateLimitWindow } from "#server/utils/rate-limit/helpers/rate-limit/rate-limit.types";

function pruneExpiredWindows(windows: Map<string, RateLimitWindow>, now: () => number, windowInMs: number): void {
  for (const [key, window] of windows) {
    if (now() - window.windowStartedAt >= windowInMs) {
      windows.delete(key);
    }
  }
}

function createFixedWindowRateLimiter(options: CreateFixedWindowRateLimiterOptions): FixedWindowRateLimiter {
  const now = options.now ?? Date.now;
  const windows: Map<string, RateLimitWindow> = new Map();

  function check(key: string): RateLimitCheckResult {
    if (windows.size > RATE_LIMIT_MAP_PRUNE_THRESHOLD) {
      pruneExpiredWindows(windows, now, options.windowInMs);
    }

    const currentTime = now();
    const window = windows.get(key);

    if (window === undefined || currentTime - window.windowStartedAt >= options.windowInMs) {
      windows.set(key, { count: 1, windowStartedAt: currentTime });

      return { isLimited: false, retryAfterInSeconds: 0 };
    }

    window.count += 1;

    if (window.count > options.maximumRequests) {
      const remainingInMs = window.windowStartedAt + options.windowInMs - currentTime;

      return {
        isLimited: true,
        retryAfterInSeconds: Math.max(MINIMUM_RETRY_AFTER_IN_SECONDS, Math.ceil(remainingInMs / MILLISECONDS_IN_SECOND)),
      };
    }
    return { isLimited: false, retryAfterInSeconds: 0 };
  }
  return { check };
}

function buildRateLimitKey(event: H3Event, trustProxy: boolean): string | undefined {
  const clientIp = trustProxy ? getRequestIP(event, { xForwardedFor: true }) : getRequestIP(event);

  if (clientIp !== undefined) {
    return clientIp;
  }

  if (!trustProxy) {
    return undefined;
  }

  const forwardedFor = getRequestHeader(event, "x-forwarded-for");
  const forwardedClientIp = forwardedFor?.split(",")[0]?.trim();

  return forwardedClientIp === "" ? undefined : forwardedClientIp;
}

// Acceptable as the shared limiter is only assigned on first use before it is ever read
// oxlint-disable-next-line typescript/init-declarations
let sharedRateLimiter: FixedWindowRateLimiter | undefined;

function getSharedRateLimiter(rateLimitConfig: AppRuntimeConfig["rateLimit"]): FixedWindowRateLimiter {
  sharedRateLimiter ??= createFixedWindowRateLimiter({
    maximumRequests: rateLimitConfig.maximumRequests,
    windowInMs: rateLimitConfig.windowInMs,
  });

  return sharedRateLimiter;
}

export {
  buildRateLimitKey,
  createFixedWindowRateLimiter,
  getSharedRateLimiter,
};