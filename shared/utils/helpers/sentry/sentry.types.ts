/**
 * Runtime configuration consumed by both Sentry entrypoints.
 */
type SentryRuntimeConfig = {
  /** Whether error tracking must initialize. */
  enabled: boolean;
  /** Ingest DSN; a public identifier, never a secret. */
  dsn: string;
  /** Deployment label attached to every event. */
  environment: string;
  /** Optional release identifier; an empty value omits the field. */
  release: string;
};

/**
 * Sentry v11 privacy controls applied to every captured event.
 */
type SentryDataCollection = {
  /** Never collect user identity fields. */
  userInfo: false;
  /** Never collect request or response bodies. */
  httpBodies: [];
  /** Header collection is constrained by the deny list; `beforeSend` removes the request object entirely. */
  httpHeaders: { deny: string[] };
  /** Cookie collection is constrained by the deny list; `beforeSend` removes the request object entirely. */
  cookies: { deny: string[] };
  /** Query collection is constrained by the deny list; `beforeSend` removes the request object entirely. */
  urlQueryParams: { deny: string[] };
};

/**
 * Options shared by the client and server `Sentry.init` calls.
 */
type SentryInitConfig = {
  dsn: string;
  environment: string;
  release?: string;
  dataCollection: SentryDataCollection;
  ignoreErrors: (string | RegExp)[];
  denyUrls: RegExp[];
};

export type { SentryDataCollection, SentryInitConfig, SentryRuntimeConfig };