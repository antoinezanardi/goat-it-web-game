import type { H3Event } from "h3";

import { CONTENT_LENGTH_PATTERN, GOAT_IT_API_MAXIMUM_REQUEST_BODY_BYTES, JSON_CONTENT_TYPE_PATTERN } from "#server/utils/goat-it-api/goat-it-api.constants";
import { HttpStatusCode } from "#server/utils/http/http.enums";

function resolveRequestBodyRejectionStatusCode(event: H3Event): HttpStatusCode | undefined {
  const contentLength = getRequestHeader(event, "content-length");

  if (contentLength === undefined || !CONTENT_LENGTH_PATTERN.test(contentLength)) {
    return HttpStatusCode.LENGTH_REQUIRED;
  }

  if (Number(contentLength) > GOAT_IT_API_MAXIMUM_REQUEST_BODY_BYTES) {
    return HttpStatusCode.PAYLOAD_TOO_LARGE;
  }

  const contentType = getRequestHeader(event, "content-type") ?? "";

  if (!JSON_CONTENT_TYPE_PATTERN.test(contentType)) {
    return HttpStatusCode.UNSUPPORTED_MEDIA_TYPE;
  }
  return undefined;
}

export { resolveRequestBodyRejectionStatusCode };