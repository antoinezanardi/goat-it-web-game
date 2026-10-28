import type { H3Event } from "h3";

import {
  GOAT_IT_API_READINESS_CACHE_TTL_IN_MS,
  GOAT_IT_API_READINESS_HEALTH_PATH,
  GOAT_IT_API_READINESS_PROBE_TIMEOUT_IN_MS,
} from "#server/utils/goat-it-api/helpers/goat-it-api-readiness/goat-it-api-readiness.constants";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";

type ReadinessCacheEntry = {
  readonly isReady: boolean;
  readonly expiresAtInMs: number;
};

let readinessCacheEntry: ReadinessCacheEntry | undefined;

let inFlightReadinessProbe: Promise<boolean> | undefined;

function createGoatItApiHealthUrl(baseUrl: string): string {
  return new URL(GOAT_IT_API_READINESS_HEALTH_PATH, baseUrl).toString();
}

async function probeGoatItApiReadiness(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(createGoatItApiHealthUrl(baseUrl), {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(GOAT_IT_API_READINESS_PROBE_TIMEOUT_IN_MS),
    });

    return response.status === HttpStatusCode.OK.valueOf();
  } catch {
    return false;
  }
}

async function probeAndCacheGoatItApiReadiness(baseUrl: string): Promise<boolean> {
  const isReady = await probeGoatItApiReadiness(baseUrl);
  readinessCacheEntry = { isReady, expiresAtInMs: Date.now() + GOAT_IT_API_READINESS_CACHE_TTL_IN_MS };
  inFlightReadinessProbe = undefined;

  return isReady;
}

/**
 * Reports whether the Goat It API health endpoint currently answers successfully.
 *
 * The probe is a single unauthenticated `GET` with a short timeout and no retry, so it never carries the game key
 * or the proxy retry budget. Results, including failures, are cached for a few seconds in the current process, and
 * concurrent calls share one in-flight probe.
 *
 * @remarks
 * Returns a bare boolean: upstream status, URL, headers, body, and error text never leave this helper. A thrown
 * local configuration error propagates instead of being reported as not ready.
 */
async function checkGoatItApiReadiness(event: H3Event): Promise<boolean> {
  const { baseUrl } = getRuntimeConfig(event).goatItApi;

  if (readinessCacheEntry !== undefined && readinessCacheEntry.expiresAtInMs > Date.now()) {
    return readinessCacheEntry.isReady;
  }

  inFlightReadinessProbe ??= probeAndCacheGoatItApiReadiness(baseUrl);

  return inFlightReadinessProbe;
}

export { checkGoatItApiReadiness };