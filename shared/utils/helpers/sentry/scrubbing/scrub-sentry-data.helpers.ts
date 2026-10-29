import { getErrorStatusCode, isClientErrorStatus } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import {
  SCRUBBED_SENTRY_BREADCRUMB_PROPERTIES,
  SCRUBBED_SENTRY_EVENT_PROPERTIES,
  SCRUBBED_SENTRY_EXCEPTION_PROPERTIES,
  SCRUBBED_SENTRY_FRAME_PROPERTIES,
  SCRUBBED_SENTRY_MESSAGE_PROPERTIES,
  SENTRY_HEALTH_CHECK_PATHS,
} from "#shared/utils/helpers/sentry/sentry.constants";

function getRequestUrl(event: object): string | undefined {
  if (!isRecord(event)) {
    return undefined;
  }

  const { request } = event;

  if (!isRecord(request)) {
    return undefined;
  }
  return typeof request.url === "string" ? request.url : undefined;
}

function isHealthCheckUrl(url: string | undefined): boolean {
  if (url === undefined) {
    return false;
  }

  try {
    return SENTRY_HEALTH_CHECK_PATHS.includes(new URL(url, "http://localhost").pathname);
  } catch {
    return false;
  }
}

function isAbortedUpstreamError(originalException: unknown): boolean {
  if (!isRecord(originalException)) {
    return false;
  }

  const { cause } = originalException;

  return isRecord(cause) && cause.name === "AbortError";
}

/**
 * Tells whether an event is an expected 4xx response, health-check traffic, or an aborted upstream request and must not be sent.
 */
function isExpectedSentryEvent(event: object, originalException: unknown): boolean {
  if (isAbortedUpstreamError(originalException)) {
    return true;
  }

  const statusCode = getErrorStatusCode(originalException);

  if (statusCode !== undefined && isClientErrorStatus(statusCode)) {
    return true;
  }
  return isHealthCheckUrl(getRequestUrl(event));
}

function attachSafeErrorCode(event: object, originalException: unknown): void {
  if (!isRecord(event) || !isRecord(originalException)) {
    return;
  }

  const { code } = originalException;

  if (typeof code !== "string") {
    return;
  }

  const tags = isRecord(event.tags) ? event.tags : {};
  Reflect.set(event, "tags", { ...tags, errorCode: code });
}

function scrubFrame(frame: unknown): void {
  if (!isRecord(frame)) {
    return;
  }

  for (const property of SCRUBBED_SENTRY_FRAME_PROPERTIES) {
    Reflect.deleteProperty(frame, property);
  }
}

function scrubStacktrace(stacktrace: unknown): void {
  if (!isRecord(stacktrace) || !Array.isArray(stacktrace.frames)) {
    return;
  }

  for (const frame of stacktrace.frames) {
    scrubFrame(frame);
  }
}

function scrubExceptionValue(exceptionValue: unknown): void {
  if (!isRecord(exceptionValue)) {
    return;
  }

  for (const property of SCRUBBED_SENTRY_EXCEPTION_PROPERTIES) {
    Reflect.deleteProperty(exceptionValue, property);
  }
  scrubStacktrace(exceptionValue.stacktrace);
}

function scrubExceptionData(event: object): void {
  if (!isRecord(event)) {
    return;
  }

  for (const property of SCRUBBED_SENTRY_MESSAGE_PROPERTIES) {
    Reflect.deleteProperty(event, property);
  }

  const { exception } = event;

  if (!isRecord(exception) || !Array.isArray(exception.values)) {
    return;
  }

  for (const exceptionValue of exception.values) {
    scrubExceptionValue(exceptionValue);
  }
}

/**
 * Removes request, identity, cookie, header, body, query, message, and stack-variable data from a Sentry event.
 *
 * Returns `null` for expected 4xx responses, health-check traffic, and client-aborted upstream requests so the SDK drops them.
 */
function scrubSentryEvent<T extends object>(event: T, originalException?: unknown): T | null {
  if (isExpectedSentryEvent(event, originalException)) {
    // Acceptable as Sentry drops an event only when the beforeSend hook returns null
    // oxlint-disable-next-line unicorn/no-null
    return null;
  }

  for (const property of SCRUBBED_SENTRY_EVENT_PROPERTIES) {
    Reflect.deleteProperty(event, property);
  }
  attachSafeErrorCode(event, originalException);
  scrubExceptionData(event);

  return event;
}

/**
 * Removes breadcrumb data that could carry request URLs, bodies, or query strings.
 *
 * Health-check fetch breadcrumbs are dropped entirely.
 */
function scrubSentryBreadcrumb<T extends object>(breadcrumb: T): T | null {
  const data = isRecord(breadcrumb) ? breadcrumb.data : undefined;
  const breadcrumbUrl = isRecord(data) && typeof data.url === "string" ? data.url : undefined;

  if (isHealthCheckUrl(breadcrumbUrl)) {
    // Acceptable as Sentry drops a breadcrumb only when the beforeBreadcrumb hook returns null
    // oxlint-disable-next-line unicorn/no-null
    return null;
  }

  for (const property of SCRUBBED_SENTRY_BREADCRUMB_PROPERTIES) {
    Reflect.deleteProperty(breadcrumb, property);
  }
  return breadcrumb;
}

export { scrubSentryBreadcrumb, scrubSentryEvent };