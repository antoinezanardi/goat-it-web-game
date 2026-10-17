type RateLimitCheckResult = {
  isLimited: boolean;
  retryAfterInSeconds: number;
};

type CreateFixedWindowRateLimiterOptions = {
  maximumRequests: number;
  windowInMs: number;
  now?: () => number;
};

type FixedWindowRateLimiter = {
  check: (key: string) => RateLimitCheckResult;
};

type RateLimitWindow = {
  count: number;
  windowStartedAt: number;
};

export type {
  CreateFixedWindowRateLimiterOptions,
  FixedWindowRateLimiter,
  RateLimitCheckResult,
  RateLimitWindow,
};