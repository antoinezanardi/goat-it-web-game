type GoatItApiErrorContext = "questions" | "question-themes" | "questions-translation";

type HandleGoatItApiErrorOptions = {
  title: string;
  context: GoatItApiErrorContext;
};

type UseGoatItApiErrorToast = {
  handleGoatItApiError: (error: unknown, options: HandleGoatItApiErrorOptions) => void;
};

export type { GoatItApiErrorContext, HandleGoatItApiErrorOptions, UseGoatItApiErrorToast };