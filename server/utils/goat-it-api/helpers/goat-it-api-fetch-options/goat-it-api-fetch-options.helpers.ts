import type { H3Event } from "h3";

import { GOAT_IT_API_REQUEST_RETRY_COUNT, GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS, GOAT_IT_API_REQUEST_TIMEOUT_IN_MS } from "#server/utils/goat-it-api/goat-it-api.constants";
import { GoatItApiHeaderNames } from "#server/utils/goat-it-api/goat-it-api.enums";
import { extractLocaleFromEvent } from "#server/utils/goat-it-api/helpers/goat-it-api-locale/goat-it-api-locale.helpers";
import type { CreateGoatItApiFetchOptionsOverrides } from "#server/utils/goat-it-api/goat-it-api.types";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";

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

export { createGoatItApiFetchOptions };