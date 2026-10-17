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

export type {
  CreateFixedWindowRateLimiterOptions,
  FixedWindowRateLimiter,
  RateLimitCheckResult,
};