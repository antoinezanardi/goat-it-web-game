import { resolveRequestBodyRejectionStatusCode } from "#server/utils/security/helpers/request-body-guard/request-body-guard.helpers";
import { GOAT_IT_API_PROXY_ERROR_CODES, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";

export default defineEventHandler((event): void => {
  if (event.method !== "POST" || !event.path.startsWith(GOAT_IT_API_PROXY_PATH_PREFIX)) {
    return;
  }

  const rejectionStatusCode = resolveRequestBodyRejectionStatusCode(event);

  if (rejectionStatusCode === undefined) {
    return;
  }

  throw createError({ statusCode: rejectionStatusCode, data: { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.INVALID_REQUEST } });
});