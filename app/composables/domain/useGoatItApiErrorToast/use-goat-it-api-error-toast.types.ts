/** Identifies the failing feature; combined with the error code to build the toast id. */
type GoatItApiErrorContext = "questions" | "question-themes" | "questions-translation";

type HandleGoatItApiErrorOptions = {
  title: string;
  context: GoatItApiErrorContext;
};

/**
 * API-error toast handler returned by `useGoatItApiErrorToast`.
 */
type UseGoatItApiErrorToast = {
  /** Always shows exactly one toast and never throws. */
  handleGoatItApiError: (error: unknown, options: HandleGoatItApiErrorOptions) => void;
};

export type { GoatItApiErrorContext, HandleGoatItApiErrorOptions, UseGoatItApiErrorToast };