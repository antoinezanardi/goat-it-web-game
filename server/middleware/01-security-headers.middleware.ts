import { API_CACHE_HEADERS, SECURITY_HEADERS } from "#server/utils/security/security-headers.constants";

const API_PATH_PREFIX = "/api/";

export default defineEventHandler((event): void => {
  setResponseHeaders(event, SECURITY_HEADERS);

  if (event.path.startsWith(API_PATH_PREFIX)) {
    setResponseHeaders(event, API_CACHE_HEADERS);
  }
});