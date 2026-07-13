import { FetchError } from "ofetch";
import { getCookie, getRequestHeader } from "h3";
import { API_RESPONSE_EXCEPTION_DTO } from "@goat-it/schemas/shared/error";
import { LOCALES } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import type { SharedRuntimeConfig } from "#build/types/runtime-config";
import type { CreateGoatItApiEndpointOptions, GoatItApiResourceName } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";

function getRuntimeConfig(event: H3Event): SharedRuntimeConfig & { public: { defaultLocale: string } } {
  // Acceptable as the NitroRuntimeConfig type does not expose custom runtimeConfig keys
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return useRuntimeConfig(event) as unknown as SharedRuntimeConfig & { public: { defaultLocale: string } };
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

function extractLocaleFromEvent(event: H3Event): string {
  const cookieLocale = getCookie(event, "i18n_redirected");
  if (isNonEmptyString(cookieLocale) && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguageHeader = getRequestHeader(event, "accept-language");
  if (isNonEmptyString(acceptLanguageHeader)) {
    const headerLocale = acceptLanguageHeader.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (isNonEmptyString(headerLocale) && (LOCALES as readonly string[]).includes(headerLocale)) {
      return headerLocale;
    }
  }

  const config = getRuntimeConfig(event);

  return config.public.defaultLocale;
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