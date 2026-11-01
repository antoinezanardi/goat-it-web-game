import type { CspMode, LogLevel, SentryEnvironment } from "#shared/types/runtime-config.types";

type RuntimeConfigOverrides = {
  baseUrl?: string;
  gameKey?: string;
  defaultLocale?: string;
  maximumRequests?: number;
  windowInMs?: number;
  trustProxy?: boolean;
  cspMode?: CspMode;
  logLevel?: LogLevel;
  sentryDsn?: string;
  sentryEnvironment?: SentryEnvironment;
  sentryDisabled?: boolean;
};

export type { RuntimeConfigOverrides };