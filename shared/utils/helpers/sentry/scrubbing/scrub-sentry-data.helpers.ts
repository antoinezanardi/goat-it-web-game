import type { Breadcrumb, ErrorEvent, Exception } from "@sentry/core";

import { getErrorStatusCode, isClientErrorStatus } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import { SENTRY_TEXT_URL_QUERY_STRING_PATTERN } from "#shared/utils/helpers/sentry/scrubbing/scrub-sentry-data.constants";
import { SENTRY_HEALTH_CHECK_PATHS } from "#shared/utils/helpers/sentry/sentry.constants";

function getRequestUrl(event: ErrorEvent): string | undefined {
  return typeof event.request?.url === "string" ? event.request.url : undefined;
}

function stripQueryString(url: string): string {
  const queryStringIndex = url.indexOf("?");

  return queryStringIndex === -1 ? url : url.slice(0, queryStringIndex);
}

function stripTextQueryStrings(text: string): string {
  return text.replace(SENTRY_TEXT_URL_QUERY_STRING_PATTERN, "$<url>");
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
function isExpectedSentryEvent(event: ErrorEvent, originalException: unknown): boolean {
  if (isAbortedUpstreamError(originalException)) {
    return true;
  }

  const statusCode = getErrorStatusCode(originalException);

  if (statusCode !== undefined && isClientErrorStatus(statusCode)) {
    return true;
  }
  return isHealthCheckUrl(getRequestUrl(event));
}

function getSafeErrorCodeTags(event: ErrorEvent, originalException: unknown): ErrorEvent["tags"] {
  if (!isRecord(originalException)) {
    return event.tags;
  }

  const { code } = originalException;

  if (typeof code !== "string") {
    return event.tags;
  }
  return { ...event.tags, errorCode: code };
}

function withQueryStringsStripped(event: ErrorEvent): ErrorEvent {
  const requestUrl = event.request?.url;

  return {
    ...event,
    ...typeof event.transaction === "string" ? { transaction: stripQueryString(event.transaction) } : {},
    ...typeof requestUrl === "string" ? { request: { ...event.request, url: stripQueryString(requestUrl) } } : {},
  };
}

function cloneSentryException(exception: Exception): Exception {
  return { ...exception };
}

function withTextQueryStringsStripped(event: ErrorEvent): ErrorEvent {
  const { exception, logentry } = event;
  const scrubbedEvent: ErrorEvent = {
    ...event,
    ...typeof event.message === "string" ? { message: stripTextQueryStrings(event.message) } : {},
  };

  if (typeof logentry?.message === "string") {
    scrubbedEvent.logentry = { ...logentry, message: stripTextQueryStrings(logentry.message) };
  }

  if (exception?.values !== undefined) {
    const values = exception.values.map(cloneSentryException);

    for (const value of values) {
      if (typeof value.value === "string") {
        value.value = stripTextQueryStrings(value.value);
      }
    }
    scrubbedEvent.exception = { ...exception, values };
  }
  return scrubbedEvent;
}

/**
 * Keeps useful error context and removes identity and arbitrary extras from a Sentry event.
 *
 * Returns `null` for expected 4xx responses, health-check traffic, and client-aborted upstream requests so the SDK drops them.
 * Query strings are removed from the transaction, request URL, message, logentry message, and exception values; headers,
 * cookies, and bodies are disabled at collection time.
 */
function scrubSentryEvent(event: ErrorEvent, originalException?: unknown): ErrorEvent | null {
  if (isExpectedSentryEvent(event, originalException)) {
    // Acceptable as Sentry drops an event only when the beforeSend hook returns null
    // oxlint-disable-next-line unicorn/no-null
    return null;
  }

  const tags = getSafeErrorCodeTags(event, originalException);
  const scrubbedEvent: ErrorEvent = {
    ...withTextQueryStringsStripped(withQueryStringsStripped(event)),
    ...tags === undefined ? {} : { tags },
  };

  delete scrubbedEvent.extra;
  delete scrubbedEvent.user;

  return scrubbedEvent;
}

function getBreadcrumbUrl(breadcrumb: Breadcrumb): string | undefined {
  const { data } = breadcrumb;

  return isRecord(data) && typeof data.url === "string" ? data.url : undefined;
}

function withBreadcrumbQueryStringStripped(breadcrumb: Breadcrumb): Breadcrumb {
  const { data } = breadcrumb;

  if (!isRecord(data) || typeof data.url !== "string") {
    return { ...breadcrumb };
  }
  return { ...breadcrumb, data: { ...data, url: stripQueryString(data.url) } };
}

/**
 * Removes query strings from a breadcrumb URL and drops health-check fetch breadcrumbs entirely.
 */
function scrubSentryBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  if (isHealthCheckUrl(getBreadcrumbUrl(breadcrumb))) {
    // Acceptable as Sentry drops a breadcrumb only when the beforeBreadcrumb hook returns null
    // oxlint-disable-next-line unicorn/no-null
    return null;
  }
  return withBreadcrumbQueryStringStripped(breadcrumb);
}

export { scrubSentryBreadcrumb, scrubSentryEvent };