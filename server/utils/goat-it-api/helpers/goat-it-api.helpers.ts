import { FetchError } from "ofetch";
import { API_RESPONSE_EXCEPTION_DTO } from "@goat-it/schemas/shared/error";

import type { SharedRuntimeConfig } from "#build/types/runtime-config";
import { GOAT_IT_API_GAME_SCOPE_NAME } from "#server/utils/goat-it-api/goat-it-api.constants";
import type { GoatItApiResourceName } from "#server/utils/goat-it-api/goat-it-api.types";
import { HttpStatusCode } from "#server/utils/http/http.enums";
import { isNonEmptyString } from "#shared/utils/helpers/string/string.helpers";

type CreateGoatItApiEndpointOptions = {
  id?: string;
  suffix?: string;
};

function createGoatItApiEndpoint(resourceName: GoatItApiResourceName, options?: CreateGoatItApiEndpointOptions): string {
  const segments = [GOAT_IT_API_GAME_SCOPE_NAME, resourceName].filter(isNonEmptyString);
  let endpoint = `/${segments.join("/")}`;

  if (isNonEmptyString(options?.id)) {
    endpoint += `/${options.id}`;
  } else if (isNonEmptyString(options?.suffix)) {
    endpoint += `/${options.suffix}`;
  }
  return endpoint;
}

function createGoatItApiFetchOptions(goatItApiRuntimeConfig: SharedRuntimeConfig["goatItApi"]): Parameters<typeof $fetch>[1] {
  return {
    baseURL: goatItApiRuntimeConfig.baseUrl,
    headers: {
      "goat-it-api-key": goatItApiRuntimeConfig.gameKey,
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
  handleGoatItApiError,
};