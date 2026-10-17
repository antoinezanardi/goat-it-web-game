import { resolveRequestBodyRejectionStatusCode } from "#server/utils/goat-it-api/helpers/request-body-guard.helpers";

const PROXY_POST_PATH_PREFIX = "/api/goat-it-api/";

export default defineEventHandler((event): void => {
  if (event.method !== "POST" || !event.path.startsWith(PROXY_POST_PATH_PREFIX)) {
    return;
  }

  const rejectionStatusCode = resolveRequestBodyRejectionStatusCode(event);

  if (rejectionStatusCode === undefined) {
    return;
  }

  throw createError({ statusCode: rejectionStatusCode, data: { errorCode: "invalid-request" } });
});