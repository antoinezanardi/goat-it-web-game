type GoatItApiErrorContext = "questions" | "question-themes" | "questions-translation";

type UseGoatItApiErrorToast = {
  handleGoatItApiError: (error: unknown, title: string, context: GoatItApiErrorContext) => void;
};

export type { GoatItApiErrorContext, UseGoatItApiErrorToast };