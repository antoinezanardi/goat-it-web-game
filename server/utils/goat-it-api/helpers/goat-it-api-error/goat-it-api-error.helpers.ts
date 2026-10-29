import { FetchError } from "ofetch";
import { API_RESPONSE_EXCEPTION_DTO } from "@goat-it/schemas/shared/error";
import { z } from "zod";

import type { ProxyErrorData } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { logServerWarning } from "#server/utils/logging/helpers/structured-logger/structured-logger.helpers";
import { SERVER_LOG_EVENT_NAMES } from "#server/utils/logging/logging.constants";
import { GOAT_IT_API_PROXY_ERROR_CODES } from "#shared/constants/goat-it-api.constants";

function logGoatItApiError(reason: string): void {
  logServerWarning(SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR, { reason });
}

function throwProxyError(statusCode: number, data: ProxyErrorData, cause?: unknown): never {
  throw createError({ statusCode, data, ...cause === undefined ? {} : { cause } });
}

function describeCause(cause: unknown): string {
  if (!(cause instanceof Error)) {
    return "unknown cause";
  }
  const causeCode = "code" in cause ? cause.code : undefined;

  if (typeof causeCode === "string" || typeof causeCode === "number") {
    return `${cause.name}: ${cause.message} (${String(causeCode)})`;
  }
  return `${cause.name}: ${cause.message}`;
}

function describeZodIssuePaths(issues: z.core.$ZodIssue[]): string {
  return issues.map(issue => issue.path.map(String).join(".")).join(", ");
}

function getForwardedErrorCode(error: FetchError): string | undefined {
  const parsedBody = API_RESPONSE_EXCEPTION_DTO.safeParse(error.data);

  return parsedBody.success ? parsedBody.data.errorCode : undefined;
}

function createRateLimitedData(error: FetchError, response: Response): ProxyErrorData {
  const data: ProxyErrorData = { errorCode: getForwardedErrorCode(error) ?? GOAT_IT_API_PROXY_ERROR_CODES.RATE_LIMITED };
  const retryAfter = response.headers.get("retry-after");

  if (retryAfter !== null) {
    data.retryAfter = retryAfter;
  }
  return data;
}

function throwGoatItApiResponseError(error: FetchError, response: Response, status: HttpStatusCode): never {
  if (status === HttpStatusCode.TOO_MANY_REQUESTS) {
    throwProxyError(HttpStatusCode.TOO_MANY_REQUESTS, createRateLimitedData(error, response));
  }

  if (status === HttpStatusCode.UNAUTHORIZED || status === HttpStatusCode.FORBIDDEN) {
    logGoatItApiError(`upstream status ${status}`);
    throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR });
  }

  if (status >= HttpStatusCode.BAD_REQUEST && status < HttpStatusCode.INTERNAL_SERVER_ERROR) {
    const parsedBody = API_RESPONSE_EXCEPTION_DTO.safeParse(error.data);

    if (parsedBody.success) {
      throwProxyError(status, parsedBody.data.errorCode === undefined ? {} : { errorCode: parsedBody.data.errorCode });
    }

    logGoatItApiError(`unparseable upstream error body for status ${status}`);
    throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR });
  }

  logGoatItApiError(`unexpected upstream status ${status}`);
  throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR });
}

function throwGoatItApiNetworkError(error: FetchError): never {
  const { cause } = error;

  if (cause instanceof Error && cause.name === "TimeoutError") {
    logGoatItApiError("upstream timeout");
    throwProxyError(HttpStatusCode.GATEWAY_TIMEOUT, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_TIMEOUT });
  }

  if (cause instanceof Error && cause.name === "AbortError") {
    throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR }, cause);
  }

  if (cause instanceof Error && cause.message === "unexpected redirect") {
    logGoatItApiError("unexpected upstream redirect");
    throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR });
  }

  logGoatItApiError(`upstream network failure [${describeCause(cause)}]`);
  throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR });
}

function throwGoatItApiFetchError(error: FetchError): never {
  const { response } = error;

  if (response === undefined) {
    throwGoatItApiNetworkError(error);
  }
  throwGoatItApiResponseError(error, response, response.status);
}

/**
 * Converts any upstream failure into a sanitized proxy error with a client-safe status, `errorCode`, and `data`.
 *
 * `FetchError` responses keep forwarded 4xx statuses when their body parses, become 502 for upstream 401/403 without forwarding messages,
 * and propagate `errorCode` plus `Retry-After` on 429. Upstream timeouts become 504. `ZodError` contract drift becomes 502.
 * Unexpected failures are logged and become 500.
 *
 * @throws Always. The caller must not rely on a return value.
 * @see docs/security.md
 */
function throwGoatItApiError(error: unknown): never {
  if (error instanceof FetchError) {
    throwGoatItApiFetchError(error);
  }

  if (error instanceof z.ZodError) {
    logGoatItApiError(`upstream payload contract drift on paths [${describeZodIssuePaths(error.issues)}]`);
    throwProxyError(HttpStatusCode.BAD_GATEWAY, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.UPSTREAM_ERROR });
  }

  logGoatItApiError("unexpected non-fetch error");
  throwProxyError(HttpStatusCode.INTERNAL_SERVER_ERROR, { errorCode: GOAT_IT_API_PROXY_ERROR_CODES.INTERNAL_ERROR });
}

export { throwGoatItApiError };