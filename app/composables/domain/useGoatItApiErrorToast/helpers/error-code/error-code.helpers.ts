import { FetchError } from "ofetch";

import { HTTP_STATUS_TO_PROXY_ERROR_CODE } from "@/composables/domain/useGoatItApiErrorToast/use-goat-it-api-error-toast.constants";
import type { GoatItApiProxyErrorCode } from "#shared/types/goat-it-api.types";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";

/**
 * Reads `error.data.data.errorCode` from a `FetchError`.
 *
 * Returns `undefined` for any other error or payload shape.
 */
function extractErrorCode(error: unknown): string | undefined {
  if (!(error instanceof FetchError) || !isRecord(error.data) || !isRecord(error.data.data)) {
    return undefined;
  }

  const { errorCode } = error.data.data;

  if (typeof errorCode !== "string") {
    return undefined;
  }
  return errorCode;
}

function extractStatusCode(error: unknown): number | undefined {
  if (!(error instanceof FetchError) || typeof error.statusCode !== "number") {
    return undefined;
  }
  return error.statusCode;
}

/**
 * Maps the HTTP status of a `FetchError` to a proxy error code.
 *
 * Returns `undefined` when the error carries no status or the status has no mapping.
 */
function resolveStatusErrorCode(error: unknown): GoatItApiProxyErrorCode | undefined {
  const statusCode = extractStatusCode(error);

  return statusCode === undefined ? undefined : HTTP_STATUS_TO_PROXY_ERROR_CODE[statusCode];
}

export { extractErrorCode, resolveStatusErrorCode };