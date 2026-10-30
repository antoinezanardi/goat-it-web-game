import type { DataCollection } from "@sentry/core";

import type { SentryEnvironment } from "#shared/types/runtime-config.types";

/**
 * Runtime configuration consumed by both Sentry entrypoints.
 */
type SentryRuntimeConfig = {
  /** Whether error tracking may initialize. */
  enabled: boolean;
  /** Ingest DSN; a public identifier, never a secret. */
  dsn: string;
  /** Deployment label attached to every event; absent outside deployed builds. */
  environment?: SentryEnvironment;
};

/**
 * Options shared by the client and server `Sentry.init` calls.
 */
type SentryInitConfig = {
  dsn: string;
  environment: SentryEnvironment;
  dataCollection: DataCollection;
  ignoreErrors: (string | RegExp)[];
  denyUrls: RegExp[];
};

export type { SentryInitConfig, SentryRuntimeConfig };