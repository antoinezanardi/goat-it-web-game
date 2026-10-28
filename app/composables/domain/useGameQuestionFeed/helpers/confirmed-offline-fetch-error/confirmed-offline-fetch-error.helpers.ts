import { FetchError } from "ofetch";

/**
 * Tells whether a failed random-question request is a confirmed-offline network failure.
 *
 * Only a `FetchError` without an HTTP response counts while the browser reports offline. Response-backed
 * failures, and no-response failures while the browser reports online, stay reportable because they may be
 * timeouts, DNS, TLS, or CORS errors rather than a confirmed offline state.
 */
function isConfirmedOfflineFetchError(error: unknown, isOnline: boolean): boolean {
  return !isOnline && error instanceof FetchError && error.response === undefined;
}

export { isConfirmedOfflineFetchError };