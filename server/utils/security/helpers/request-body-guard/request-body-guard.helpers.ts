import type { H3Event } from "h3";

import { CONTENT_LENGTH_PATTERN, JSON_CONTENT_TYPE_PATTERN, MAXIMUM_REQUEST_BODY_BYTES } from "#server/utils/security/helpers/request-body-guard/request-body-guard.constants";
import { HttpStatusCode } from "#server/utils/http/http.enums";

/**
 * Decides from headers alone whether a POST body must be rejected before it is buffered.
 *
 * Returns 411 when `content-length` is missing or invalid, 413 when it exceeds the size cap, 415 when `content-type` is not JSON,
 * and `undefined` when the body may be read.
 *
 * @see docs/security.md
 */
function resolveRequestBodyRejectionStatusCode(event: H3Event): HttpStatusCode | undefined {
  const contentLength = getRequestHeader(event, "content-length");

  if (contentLength === undefined || !CONTENT_LENGTH_PATTERN.test(contentLength)) {
    return HttpStatusCode.LENGTH_REQUIRED;
  }

  if (Number(contentLength) > MAXIMUM_REQUEST_BODY_BYTES) {
    return HttpStatusCode.PAYLOAD_TOO_LARGE;
  }

  const contentType = getRequestHeader(event, "content-type") ?? "";

  if (!JSON_CONTENT_TYPE_PATTERN.test(contentType)) {
    return HttpStatusCode.UNSUPPORTED_MEDIA_TYPE;
  }
  return undefined;
}

export { resolveRequestBodyRejectionStatusCode };