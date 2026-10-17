import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config.helpers";
import { buildRateLimitKey, getSharedRateLimiter } from "#server/utils/rate-limit/helpers/rate-limit.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";

const RATE_LIMIT_PATH_PREFIX = "/api/goat-it-api/";

export default defineEventHandler((event): void => {
  if (!event.path.startsWith(RATE_LIMIT_PATH_PREFIX)) {
    return;
  }

  const { rateLimit } = getRuntimeConfig(event);
  const { isLimited, retryAfterInSeconds } = getSharedRateLimiter(rateLimit).check(buildRateLimitKey(event, rateLimit.trustProxy));

  if (!isLimited) {
    return;
  }

  setResponseHeader(event, "Retry-After", retryAfterInSeconds);
  throw createError({
    statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
    statusMessage: "Too Many Requests",
    data: { errorCode: "rate-limited" },
  });
});