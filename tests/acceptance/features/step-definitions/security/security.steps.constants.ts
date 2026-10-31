const SECURITY_API_PROXY_ROUTE = "/api/goat-it-api/question-themes";

const SECURITY_EXPECTED_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), fullscreen=(), display-capture=()",
  "strict-transport-security": "max-age=31536000",
} as const;

const SECURITY_EXPECTED_API_CACHE_HEADERS = {
  "cache-control": "private, no-store",
  "vary": "Cookie",
} as const;

const SECURITY_CSP_NONCE_PATTERN = /'nonce-(?<nonce>[^']+)'/u;

const SECURITY_CSP_CONSOLE_MATCH = "Content Security Policy";

const SECURITY_PAGE_SETTLE_MS = 500;

export {
  SECURITY_API_PROXY_ROUTE,
  SECURITY_CSP_CONSOLE_MATCH,
  SECURITY_CSP_NONCE_PATTERN,
  SECURITY_EXPECTED_API_CACHE_HEADERS,
  SECURITY_EXPECTED_HEADERS,
  SECURITY_PAGE_SETTLE_MS,
};