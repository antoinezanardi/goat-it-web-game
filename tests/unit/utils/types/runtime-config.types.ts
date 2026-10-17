import type { CspMode } from "#shared/types/runtime-config.types";

type RuntimeConfigOverrides = {
  baseUrl?: string;
  gameKey?: string;
  defaultLocale?: string;
  maximumRequests?: number;
  windowInMs?: number;
  trustProxy?: boolean;
  cspMode?: CspMode;
};

export type { RuntimeConfigOverrides };