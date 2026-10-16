import { FetchError } from "ofetch";
import { getCookie } from "h3";
import { API_RESPONSE_EXCEPTION_DTO } from "@goat-it/schemas/shared/error";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { GOAT_IT_API_REQUEST_RETRY_COUNT, GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS, GOAT_IT_API_REQUEST_TIMEOUT_IN_MS } from "#server/utils/goat-it-api/goat-it-api.constants";
import type { CreateGoatItApiEndpointOptions, GoatItApiResourceName } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { CookieNames } from "#shared/enums/cookie.enums";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";
import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

function getRuntimeConfig(event: H3Event): AppRuntimeConfig {
  // Acceptable as the NitroRuntimeConfig type does not expose custom runtimeConfig keys
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return useRuntimeConfig(event) as unknown as AppRuntimeConfig;
}

function createGoatItApiEndpoint(resourceName: GoatItApiResourceName, options?: CreateGoatItApiEndpointOptions): string {
  let endpoint = `/${resourceName}`;

  if (isNonEmptyString(options?.id)) {
    endpoint += `/${options.id}`;
  } else if (isNonEmptyString(options?.suffix)) {
    endpoint += `/${options.suffix}`;
  }
  return endpoint;
}

function extractLocaleFromEvent(event: H3Event): Locale {
  const config = getRuntimeConfig(event);

  return resolveCookieLocale(getCookie(event, CookieNames.I18N_REDIRECTED), config.public.defaultLocale);
}

function createGoatItApiFetchOptions(event: H3Event): Parameters<typeof $fetch>[1] {
  const config = getRuntimeConfig(event);

  return {
    baseURL: config.goatItApi.baseUrl,
    headers: {
      "goat-it-api-key": config.goatItApi.gameKey,
      "Accept-Language": extractLocaleFromEvent(event),
    },
    retry: GOAT_IT_API_REQUEST_RETRY_COUNT,
    retryDelay: GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS,
    timeout: GOAT_IT_API_REQUEST_TIMEOUT_IN_MS,
  };
}

function handleGoatItApiError(error: unknown): never {
  if (!(error instanceof FetchError)) {
    throw error;
  }

  const parsedError = API_RESPONSE_EXCEPTION_DTO.safeParse(error.data);

  if (!parsedError.success) {
    throw createError({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }

  throw createError({
    statusCode: parsedError.data.statusCode,
    data: { errorCode: parsedError.data.errorCode },
  });
}

export {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
  handleGoatItApiError,
};