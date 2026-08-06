import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

export const useGameStore = defineStore(StoreNames.GAME, () => {
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

  async function fetchAndAppendRandomQuestions(body?: FindRandomQuestionsBodyDto): Promise<void> {
    const fetched = await fetchRandomQuestions(body);
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