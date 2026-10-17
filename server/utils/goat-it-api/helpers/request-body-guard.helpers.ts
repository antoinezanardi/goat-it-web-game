import type { H3Event } from "h3";

import { GOAT_IT_API_MAXIMUM_REQUEST_BODY_BYTES } from "#server/utils/goat-it-api/goat-it-api.constants";
import { HttpStatusCode } from "#server/utils/http/http.enums";

const CONTENT_LENGTH_PATTERN = /^\d+$/u;
const JSON_CONTENT_TYPE_PATTERN = /^application\/json(?:;|$)/iu;

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