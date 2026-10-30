/**
 * Options for building the Content-Security-Policy header of one rendered page.
 */
type BuildContentSecurityPolicyOptions = {
  /** Per-render nonce substituted into the script-src placeholder. */
  nonce: string;
  /** Sentry DSN whose exact ingest origin is appended to connect-src when valid. */
  sentryDsn?: string;
};

export type { BuildContentSecurityPolicyOptions };