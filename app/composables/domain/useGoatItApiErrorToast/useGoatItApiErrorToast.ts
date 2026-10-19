import { extractErrorCode, resolveStatusErrorCode } from "@/composables/domain/useGoatItApiErrorToast/helpers/error-code/error-code.helpers";
import type {
  GoatItApiErrorContext,
  UseGoatItApiErrorToast,
} from "@/composables/domain/useGoatItApiErrorToast/use-goat-it-api-error-toast.types";

function useGoatItApiErrorToast(): UseGoatItApiErrorToast {
  const { addErrorToast } = useAppToast();
  const i18n = useI18n();

  function handleGoatItApiError(error: unknown, title: string, context: GoatItApiErrorContext): void {
    const errorCodeValue = extractErrorCode(error);

    if (errorCodeValue !== undefined && errorCodeValue !== "") {
      const errorCodeI18nKey = `errors.goatItApi.${errorCodeValue}`;

      if (i18n.te(errorCodeI18nKey)) {
        addErrorToast({ title, description: i18n.t(errorCodeI18nKey), id: `${context}-api-error-${errorCodeValue}` });

        return;
      }

      console.error(`Unknown Goat It API error code: ${errorCodeValue}`);
    }

    const statusErrorCode = resolveStatusErrorCode(error);

    if (statusErrorCode !== undefined) {
      addErrorToast({ title, description: i18n.t(`errors.goatItApi.${statusErrorCode}`), id: `${context}-api-error-${statusErrorCode}` });

      return;
    }

    addErrorToast({ title, description: i18n.t("errors.unknown"), id: `${context}-api-error-unknown` });
  }
  return { handleGoatItApiError };
}

export { useGoatItApiErrorToast };