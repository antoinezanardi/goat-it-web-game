import { FetchError } from "ofetch";

import { HTTP_STATUS_TO_PROXY_ERROR_CODE } from "~/composables/domain/useGoatItApiErrorToast/use-goat-it-api-error-toast.constants";
import type { UseGoatItApiErrorToast } from "~/composables/domain/useGoatItApiErrorToast/use-goat-it-api-error-toast.types";
import type { GoatItApiProxyErrorCode } from "#shared/types/goat-it-api.types";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";

function extractErrorCode(error: unknown): string | undefined {
  if (!(error instanceof FetchError) || !isRecord(error.data) || !isRecord(error.data.data)) {
    return undefined;
  }

  const { errorCode } = error.data.data;

  if (typeof errorCode !== "string") {
    return undefined;
  }
  return errorCode;
}

function extractStatusCode(error: unknown): number | undefined {
  if (!(error instanceof FetchError) || typeof error.statusCode !== "number") {
    return undefined;
  }
  return error.statusCode;
}

function resolveStatusErrorCode(error: unknown): GoatItApiProxyErrorCode | undefined {
  const statusCode = extractStatusCode(error);

  return statusCode === undefined ? undefined : HTTP_STATUS_TO_PROXY_ERROR_CODE[statusCode];
}

function useGoatItApiErrorToast(): UseGoatItApiErrorToast {
  const { addErrorToast } = useAppToast();
  const i18n = useI18n();

  function handleGoatItApiError(error: unknown, title: string): void {
    const errorCodeValue = extractErrorCode(error);

    if (errorCodeValue !== undefined && errorCodeValue !== "") {
      const errorCodeI18nKey = `errors.goatItApi.${errorCodeValue}`;

      if (i18n.te(errorCodeI18nKey)) {
        addErrorToast({ title, description: i18n.t(errorCodeI18nKey), id: `api-error-${errorCodeValue}` });

        return;
      }

      console.error(`Unknown Goat It API error code: ${errorCodeValue}`);
    }

    const statusErrorCode = resolveStatusErrorCode(error);

    if (statusErrorCode !== undefined) {
      addErrorToast({ title, description: i18n.t(`errors.goatItApi.${statusErrorCode}`), id: `api-error-${statusErrorCode}` });

      return;
    }

    addErrorToast({ title, description: i18n.t("errors.unknown"), id: "api-error-unknown" });
  }
  return { handleGoatItApiError };
}

export { useGoatItApiErrorToast, extractErrorCode };