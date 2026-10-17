const SCRIPT_TAG_WITHOUT_NONCE_PATTERN = /<script(?![^>]*\snonce=)/gu;

function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'wasm-unsafe-eval' 'nonce-${nonce}'`,
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
  ].join("; ");
}

function generateCspNonce(): string {
  return crypto.randomUUID();
}

function stampNonceOnInlineScripts(htmlChunks: string[], nonce: string): string[] {
  return htmlChunks.map(chunk => chunk.replace(SCRIPT_TAG_WITHOUT_NONCE_PATTERN, `<script nonce="${nonce}"`));
}

export {
  buildContentSecurityPolicy,
  generateCspNonce,
  stampNonceOnInlineScripts,
};