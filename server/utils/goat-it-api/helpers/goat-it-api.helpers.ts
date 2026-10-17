import { getCookie } from "h3";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import { GOAT_IT_API_REQUEST_RETRY_COUNT, GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS, GOAT_IT_API_REQUEST_TIMEOUT_IN_MS } from "#server/utils/goat-it-api/goat-it-api.constants";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config.helpers";
import type { GoatItApiResourceNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import { GoatItApiHeaderNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import type { CreateGoatItApiEndpointOptions, CreateGoatItApiFetchOptionsOverrides } from "#server/utils/goat-it-api/goat-it-api.types";
import { CookieNames } from "#shared/enums/cookie.enums";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";
import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

function encodePathSegment(segment: string): string {
  return segment.split("/").map(part => encodeURIComponent(part)).join("/");
}

function createGoatItApiEndpoint(resourceName: GoatItApiResourceNames, options?: CreateGoatItApiEndpointOptions): string {
  let endpoint = `/${resourceName}`;

  if (isNonEmptyString(options?.id)) {
    endpoint += `/${encodePathSegment(options.id)}`;
  } else if (isNonEmptyString(options?.suffix)) {
    endpoint += `/${encodePathSegment(options.suffix)}`;
  }
  return endpoint;
}

function extractLocaleFromEvent(event: H3Event, defaultLocale: Locale): Locale {
  return resolveCookieLocale(getCookie(event, CookieNames.I18N_REDIRECTED), defaultLocale);
}

function createGoatItApiAbortSignal(event: H3Event): AbortSignal {
  const disconnectController = new AbortController();

  event.node.res.on("close", () => {
    if (!event.node.res.writableEnded) {
      disconnectController.abort();
    }
  });

  return AbortSignal.any([disconnectController.signal, AbortSignal.timeout(GOAT_IT_API_REQUEST_TIMEOUT_IN_MS)]);
}

function createGoatItApiFetchOptions(event: H3Event, options?: CreateGoatItApiFetchOptionsOverrides): Parameters<typeof $fetch>[1] {
  const config = getRuntimeConfig(event);
  const method = options?.method ?? "GET";

  return {
    baseURL: config.goatItApi.baseUrl,
    headers: {
      [GoatItApiHeaderNames.API_KEY]: config.goatItApi.gameKey,
      [GoatItApiHeaderNames.ACCEPT_LANGUAGE]: extractLocaleFromEvent(event, config.public.defaultLocale),
    },
    redirect: "error",
    retry: method === "POST" ? 0 : GOAT_IT_API_REQUEST_RETRY_COUNT,
    retryDelay: GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS,
    signal: createGoatItApiAbortSignal(event),
  };
}

export {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
};