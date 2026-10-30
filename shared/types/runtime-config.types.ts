import type { Locale } from "@goat-it/schemas/shared/locale";
import type { RuntimeConfig } from "nuxt/schema";

/**
 * Content-Security-Policy enforcement mode.
 *
 * `enforce` blocks violations, `report-only` reports them without blocking, and `off` disables the header.
 */
type CspMode = "enforce" | "report-only" | "off";

/**
 * Server log verbosity accepted by the structured logger.
 */
type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

/**
 * Deployment environment label attached to error-tracking events; error tracking never runs in dev or test.
 */
type SentryEnvironment = "production" | "staging";

/**
 * Runtime configuration consumed by both the app and the server.
 *
 * Values are validated at boot; invalid values abort the server start.
 */
type AppRuntimeConfig = RuntimeConfig & {
  goatItApi: {
    /** Goat It API base URL; HTTP(S) only, and HTTPS in production unless the host is internal. */
    baseUrl: string;
    /** Non-empty key identifying this game in Goat It API requests. */
    gameKey: string;
  };
  rateLimit: {
    /** Maximum requests allowed per client key in one window. */
    maximumRequests: number;
    /** Fixed rate-limit window duration in milliseconds. */
    windowInMs: number;
    /** Whether to trust `x-forwarded-for`; enable only behind a proxy that overwrites it. */
    trustProxy: boolean;
  };
  security: {
    /** CSP enforcement mode applied to every rendered page. */
    cspMode: CspMode;
  };
  logger: {
    /** Minimum level emitted by the server structured logger. */
    level: LogLevel;
  };
  public: {
    /** Locale used when no valid locale cookie is present. */
    defaultLocale: Locale;
    sentry: {
      /** Sentry ingest DSN; a public ingest identifier, never a secret. */
      dsn: string;
      /** Deployment label attached to captured events; absent outside deployed environments. */
      environment?: SentryEnvironment;
      /** Forces error tracking off when true; the acceptance build sets it to keep tests offline. */
      disabled: boolean;
    };
  };
};

export type {
  AppRuntimeConfig,
  CspMode,
  LogLevel,
  SentryEnvironment,
};