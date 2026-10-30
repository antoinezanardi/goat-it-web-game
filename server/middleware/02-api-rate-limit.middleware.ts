import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";
import { buildRateLimitKey, getSharedRateLimiter } from "#server/utils/rate-limit/helpers/rate-limit/rate-limit.helpers";
import { HttpStatusCode } from "#shared/enums/http-status-code.enums";
import { GOAT_IT_API_PROXY_ERROR_CODES, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";

export default defineEventHandler((event): void => {
  if (!event.path.startsWith(GOAT_IT_API_PROXY_PATH_PREFIX)) {
    return;
  }

  const { rateLimit } = getRuntimeConfig(event);
  const rateLimitKey = buildRateLimitKey(event, rateLimit.trustProxy);

  if (rateLimitKey === undefined) {
    return;
  }

  const { isLimited, retryAfterInSeconds } = getSharedRateLimiter(rateLimit).check(rateLimitKey);

  if (!isLimited) {
    return;
  }

  setResponseHeader(event, "Retry-After", retryAfterInSeconds);
  throw createError({
    statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
    statusMessage: "Too Many Requests",
    data: { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.RATE_LIMITED },
  });
});