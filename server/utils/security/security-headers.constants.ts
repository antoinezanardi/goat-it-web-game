const API_ROUTE_PATH_PREFIX = "/api/";

const SECURITY_HEADERS = {
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), fullscreen=(), display-capture=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

const API_CACHE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Vary": "Cookie",
} as const;

const CSP_ENFORCE_HEADER_NAME = "Content-Security-Policy";
const CSP_REPORT_ONLY_HEADER_NAME = "Content-Security-Policy-Report-Only";
const CSP_NONCE_PLACEHOLDER = "%NONCE%";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src 'self' 'wasm-unsafe-eval' 'nonce-${CSP_NONCE_PLACEHOLDER}'`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
] as const;

const SCRIPT_TAG_WITHOUT_NONCE_PATTERN = /<script(?![^>]*\snonce=)/giu;

export {
  API_CACHE_HEADERS,
  API_ROUTE_PATH_PREFIX,
  CSP_DIRECTIVES,
  CSP_ENFORCE_HEADER_NAME,
  CSP_NONCE_PLACEHOLDER,
  CSP_REPORT_ONLY_HEADER_NAME,
  SCRIPT_TAG_WITHOUT_NONCE_PATTERN,
  SECURITY_HEADERS,
};