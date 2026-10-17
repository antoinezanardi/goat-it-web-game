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

export { API_CACHE_HEADERS, SECURITY_HEADERS };