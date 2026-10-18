import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

export const useGameStore = defineStore(StoreNames.GAME, () => {
  const questions = ref<Question[]>([]);

  const repository = questionsRepository(useRequestFetch());
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

  const {
    execute: fetchQuestionsByIds,
    fetchStatus: fetchQuestionsByIdsStatus,
    isPending: isFetchingQuestionsByIds,
  } = useAsyncAction(
    repository.getByIds,
    (thrownError: unknown) => handleGoatItApiError(thrownError, t("questions.cantFetch")),
  );

  async function fetchAndAppendRandomQuestions(body?: FindRandomQuestionsBodyDto): Promise<void> {
    const fetched = await fetchRandomQuestions(body);
    if (fetched) {
      questions.value.push(...fetched);
    }
  }

  function resetQuestions(): void {
    questions.value = [];
  }

  function truncateQuestions(length: number): void {
    questions.value = questions.value.slice(0, length);
  }

  function replaceQuestions(updatedQuestions: Question[]): void {
    questions.value = updatedQuestions;
  }
  return {
    questions,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
    fetchAndAppendRandomQuestions,
    resetQuestions,
    truncateQuestions,
    replaceQuestions,
    fetchQuestionsByIds,
    fetchQuestionsByIdsStatus,
    isFetchingQuestionsByIds,
  };
});