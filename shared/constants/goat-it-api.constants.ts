const FIND_QUERY_UNBOUNDED_LIMIT = 0;
const FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM = 100;
const FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM = 100;

const GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS = 15_000;

const GOAT_IT_API_PROXY_ERROR_CODES = [
  "invalid-request",
  "rate-limited",
  "upstream-error",
  "upstream-timeout",
  "internal-error",
] as const;

type GoatItApiProxyErrorCode = (typeof GOAT_IT_API_PROXY_ERROR_CODES)[number];

export type {
  GoatItApiProxyErrorCode,
};

export {
  FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM,
  FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM,
  FIND_QUERY_UNBOUNDED_LIMIT,
  GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS,
  GOAT_IT_API_PROXY_ERROR_CODES,
};