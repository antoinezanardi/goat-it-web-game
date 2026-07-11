import type { FindQuestionsQueryDto } from "@goat-it/schemas/question";

export const useQuestionsStore = defineStore(StoreNames.QUESTIONS, () => {
  const questions = ref<Question[]>([]);

  const repository = questionsRepository($fetch);
  const { handleGoatItApiError } = useGoatItApiErrorToast();
  const { t } = useI18n();

  const {
    execute: fetchRandomQuestions,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
  } = useAsyncAction(
    repository.getRandom,
    (thrownError: unknown) => handleGoatItApiError(thrownError, t("questions.cantFetch")),
  );

  async function fetchAndAppendRandomQuestions(query?: FindQuestionsQueryDto): Promise<void> {
    const fetched = await fetchRandomQuestions(query);
    if (fetched) {
      questions.value = [...questions.value, ...fetched];
    }
  }
  return {
    questions,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
    fetchRandomQuestions,
    fetchAndAppendRandomQuestions,
  };
});