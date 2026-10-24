import type { z } from "zod";

/**
 * Path options for `createGoatItApiEndpoint`.
 */
type CreateGoatItApiEndpointOptions = {
  /** Appended as an encoded path segment; wins over `suffix` when both are non-empty. */
  id?: string;
  /** Appended as an encoded path segment only when `id` is absent or empty. */
  suffix?: string;
};

/**
 * Per-call overrides for the upstream fetch options.
 */
type CreateGoatItApiFetchOptionsOverrides = {
  /** Upstream HTTP method; POST is never retried. Defaults to `GET`. */
  method?: "GET" | "POST";
};

/**
 * Client-facing `data` payload attached to every proxy error response.
 */
type ProxyErrorData = {
  /** Machine-readable code that the client resolves as `errors.goatItApi.<code>`. */
  errorCode?: string;
  /** Raw upstream `Retry-After` value, propagated only on a 429. */
  retryAfter?: string;
};

/**
 * Zod issue describing keys the upstream response added that the schema does not know about.
 */
type UnrecognizedKeysIssue = z.core.$ZodIssueUnrecognizedKeys;

export type {
  CreateGoatItApiEndpointOptions,
  CreateGoatItApiFetchOptionsOverrides,
  ProxyErrorData,
  UnrecognizedKeysIssue,
};