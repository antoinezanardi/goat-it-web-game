import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { AsyncDataRequestStatus } from "#app";
import { GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS } from "#shared/constants/goat-it-api.constants";

export const useGameStore = defineStore(StoreNames.GAME, () => {
  const questions = ref<Question[]>([]);

  const repository = questionsRepository(useRequestFetch());

  const {
    execute: fetchRandomQuestions,
    fetchStatus: randomQuestionsFetchStatus,
    isPending,
    isSuccess,
    isError,
  } = useAsyncAction(async({ signal }, body?: FindRandomQuestionsBodyDto) => repository.getRandom(body, { signal }), GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS);

  const {
    execute: fetchQuestionsByIds,
    fetchStatus: questionsByIdsFetchStatus,
    isPending: isFetchingQuestionsByIds,
  } = useAsyncAction(async({ signal }, ids: string[]) => repository.getByIds(ids, { signal }), GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS);

  const fetchStatus = computed<AsyncDataRequestStatus>(() => randomQuestionsFetchStatus.value);
  const fetchQuestionsByIdsStatus = computed<AsyncDataRequestStatus>(() => questionsByIdsFetchStatus.value);

  async function fetchAndAppendRandomQuestions(body?: FindRandomQuestionsBodyDto): Promise<AsyncResult<Question[]>> {
    const result = await fetchRandomQuestions(body);
    if (!result.ok) {
      return result;
    }
    const appendedQuestions: Question[] = [];
    const knownQuestionIds: Set<string> = new Set(questions.value.map(question => question.id));
    for (const question of result.value) {
      if (!knownQuestionIds.has(question.id)) {
        knownQuestionIds.add(question.id);
        appendedQuestions.push(question);
      }
    }
    questions.value.push(...appendedQuestions);

    return { ok: true, value: appendedQuestions };
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