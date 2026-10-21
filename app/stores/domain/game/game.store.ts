import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { AsyncDataRequestStatus } from "#app";

export const useGameStore = defineStore(StoreNames.GAME, () => {
  const questions = ref<Question[]>([]);

  const repository = questionsRepository(useRequestFetch());

  const {
    execute: fetchRandomQuestions,
    fetchStatus: randomQuestionsFetchStatus,
    isPending,
    isSuccess,
    isError,
  } = useAsyncAction(repository.getRandom);

  const {
    execute: fetchQuestionsByIds,
    fetchStatus: questionsByIdsFetchStatus,
    isPending: isFetchingQuestionsByIds,
  } = useAsyncAction(repository.getByIds);

  const fetchStatus = computed<AsyncDataRequestStatus>(() => randomQuestionsFetchStatus.value);
  const fetchQuestionsByIdsStatus = computed<AsyncDataRequestStatus>(() => questionsByIdsFetchStatus.value);

  async function fetchAndAppendRandomQuestions(body?: FindRandomQuestionsBodyDto): Promise<AsyncResult<Question[]>> {
    const result = await fetchRandomQuestions(body);
    if (result.ok) {
      questions.value.push(...result.value);
    }
    return result;
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