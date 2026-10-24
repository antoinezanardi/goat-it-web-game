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

/**
 * Creates an in-memory fixed-window limiter: each key gets a window that starts on its first request and lasts `windowInMs`.
 *
 * The first request in a window is always allowed. Later requests over `maximumRequests` are limited until the window expires,
 * and `retryAfterInSeconds` reports the remaining time. Expired windows are pruned only once the map grows past a threshold,
 * so idle keys linger briefly.
 *
 * @remarks State lives in this process only; scale-out deployments need a shared store instead.
 */
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

/**
 * Builds the limiter key for a request from its client IP.
 *
 * `x-forwarded-for` is trusted only when `trustProxy` is enabled; the caller's proxy must overwrite that header.
 * Returns `undefined` when no IP can be resolved, which callers treat as "do not rate limit".
 *
 * @see docs/security.md
 */
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

/**
 * Returns the process-wide limiter, creating it from the first runtime configuration seen.
 *
 * @remarks Later calls ignore their configuration, so a config change requires a process restart.
 */
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