import { FetchError } from "ofetch";

import type { GoatItApiProxyErrorCode } from "#shared/constants/goat-it-api.constants";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";

type UseGoatItApiErrorToast = {
  handleGoatItApiError: (error: unknown, title: string) => void;
};

const HTTP_STATUS_TO_PROXY_ERROR_CODE: Readonly<Partial<Record<number, GoatItApiProxyErrorCode>>> = {
  400: "invalid-request",
  429: "rate-limited",
  500: "internal-error",
  502: "upstream-error",
  503: "upstream-error",
  504: "upstream-timeout",
};

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

function resolveStatusErrorCode(error: unknown): string | undefined {
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
      addErrorToast({ title, description: i18n.t("errors.unknown"), id: "api-error-unknown" });

      return;
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

export type { UseGoatItApiErrorToast };

export { useGoatItApiErrorToast, extractErrorCode };