import { FetchError } from "ofetch";

import { isRecord } from "#shared/utils/helpers/object/object.helpers";

type UseGoatItApiErrorToast = {
  handleGoatItApiError: (error: unknown, title: string) => void;
};

function extractErrorCode(error: unknown): string | undefined {
  if (!(error instanceof FetchError)) {
    return undefined;
  }

  if (!isRecord(error.data)) {
    return undefined;
  }

  if (!isRecord(error.data.data)) {
    return undefined;
  }

  const { errorCode } = error.data.data;

  if (typeof errorCode !== "string") {
    return undefined;
  }
  return errorCode;
}

function useGoatItApiErrorToast(): UseGoatItApiErrorToast {
  const { addErrorToast } = useAppToast();
  const i18n = useI18n();

  function handleGoatItApiError(error: unknown, title: string): void {
    const errorCodeValue = extractErrorCode(error);

    if (errorCodeValue === undefined || errorCodeValue === "") {
      addErrorToast({ title, description: i18n.t("errors.unknown"), id: "api-error-unknown" });

      return;
    }

    const i18nKey = `errors.goatItApi.${errorCodeValue}`;

    if (i18n.te(i18nKey)) {
      addErrorToast({ title, description: i18n.t(i18nKey), id: `api-error-${errorCodeValue}` });

      return;
    }

    console.error(`Unknown Goat It API error code: ${errorCodeValue}`);
    addErrorToast({ title, description: i18n.t("errors.unknown"), id: "api-error-unknown" });
  }
  return { handleGoatItApiError };
}

export type { UseGoatItApiErrorToast };

export { useGoatItApiErrorToast, extractErrorCode };