import { FetchError } from "ofetch";
import { getCookie } from "h3";
import { API_RESPONSE_EXCEPTION_DTO } from "@goat-it/schemas/shared/error";
import { isValidLocale } from "@goat-it/schemas/shared/locale";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import type { CreateGoatItApiEndpointOptions, GoatItApiResourceName } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";
import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

const DEFAULT_LOCALE_FALLBACK = "en";

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
  const { defaultLocale } = config.public;
  const fallbackLocale = isValidLocale(defaultLocale) ? defaultLocale : DEFAULT_LOCALE_FALLBACK;

  return resolveCookieLocale(getCookie(event, "i18n_redirected"), fallbackLocale);
}

function createGoatItApiFetchOptions(event: H3Event): Parameters<typeof $fetch>[1] {
  const config = getRuntimeConfig(event);

  return {
    baseURL: config.goatItApi.baseUrl,
    headers: {
      "goat-it-api-key": config.goatItApi.gameKey,
      "Accept-Language": extractLocaleFromEvent(event),
    },
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
      message: "Internal server error",
    });
  }

  throw createError({
    statusCode: parsedError.data.statusCode,
    message: parsedError.data.message,
    data: { errorCode: parsedError.data.errorCode },
  });
}

export {
  createGoatItApiEndpoint,
  createGoatItApiFetchOptions,
  extractLocaleFromEvent,
  handleGoatItApiError,
};