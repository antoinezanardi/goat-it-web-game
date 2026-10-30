import { captureException } from "@sentry/nuxt";

import { extractErrorCode, resolveStatusErrorCode } from "@/composables/domain/useGoatItApiErrorToast/helpers/error-code/error-code.helpers";
import type {
  HandleGoatItApiErrorOptions,
  UseGoatItApiErrorToast,
} from "@/composables/domain/useGoatItApiErrorToast/use-goat-it-api-error-toast.types";
import { isUnexpectedClientError } from "@/utils/core/sentry/helpers/client-error-report/client-error-report.helpers";

/**
 * Reports Goat It API failures as a single deduplicated error toast.
 *
 * The upstream `errorCode` is resolved first, then the mapped HTTP status, then `errors.unknown`.
 * Unknown upstream codes are logged before falling back. Toast ids include the context and code, so repeated
 * failures replace the same toast instead of stacking. Unexpected caught failures are reported once to error
 * tracking, while expected 4xx and cancelled outcomes are not.
 */
function useGoatItApiErrorToast(): UseGoatItApiErrorToast {
  const { addErrorToast } = useAppToast();
  const i18n = useI18n();

  function handleGoatItApiError(error: unknown, options: HandleGoatItApiErrorOptions): void {
    const { context, title } = options;

    if (import.meta.client && isUnexpectedClientError(error)) {
      captureException(error);
    }

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