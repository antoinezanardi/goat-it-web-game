/**
 * Outcome of one rate-limit check.
 */
type RateLimitCheckResult = {
  /** True when this request exceeded the budget and must be rejected. */
  isLimited: boolean;
  /** Seconds until the current window resets; `0` when the request is allowed. */
  retryAfterInSeconds: number;
};

/**
 * Configuration for a fixed-window limiter.
 */
type CreateFixedWindowRateLimiterOptions = {
  /** Requests allowed per window per key, including the first one. */
  maximumRequests: number;
  /** Window length in milliseconds, measured from the key's first request. */
  windowInMs: number;
  /** Clock injection for deterministic tests; defaults to `Date.now`. */
  now?: () => number;
};

/**
 * In-memory fixed-window limiter.
 */
type FixedWindowRateLimiter = {
  /** Records one request for the key and reports whether its budget is exhausted. */
  check: (key: string) => RateLimitCheckResult;
};

/**
 * Per-key bookkeeping for the current window.
 */
type RateLimitWindow = {
  /** Requests seen in the window, including rejected ones. */
  count: number;
  /** Epoch milliseconds at which the window opened. */
  windowStartedAt: number;
};

export type {
  CreateFixedWindowRateLimiterOptions,
  FixedWindowRateLimiter,
  RateLimitCheckResult,
  RateLimitWindow,
};