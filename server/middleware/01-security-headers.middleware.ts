import { API_CACHE_HEADERS, API_ROUTE_PATH_PREFIX, SECURITY_HEADERS } from "#server/utils/security/security-headers.constants";

export default defineEventHandler((event): void => {
  setResponseHeaders(event, SECURITY_HEADERS);

  if (event.path.startsWith(API_ROUTE_PATH_PREFIX)) {
    setResponseHeaders(event, API_CACHE_HEADERS);
  }
});