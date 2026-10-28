import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { AsyncDataRequestStatus } from "#app";
import { GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS } from "#shared/constants/goat-it-api.constants";

/**
 * Owns the buffered questions of the current game and is the only allowed mutation path for them.
 *
 * Consumers read `questions` and change the buffer only through this store's actions.
 */
export const useGameStore = defineStore(StoreNames.GAME, () => {
  /** Buffered questions; appends mutate this array in place. */
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

  /** Read-only view of the random-questions fetch status. */
  const fetchStatus = computed<AsyncDataRequestStatus>(() => randomQuestionsFetchStatus.value);
  /** Read-only view of the by-ids fetch status. */
  const fetchQuestionsByIdsStatus = computed<AsyncDataRequestStatus>(() => questionsByIdsFetchStatus.value);

  /**
   * Fetches random questions and appends them to the buffer only when the request succeeds.
   *
   * Returns the fetch result, whose value holds only the newly fetched questions; the buffer stays untouched on failure.
   */
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

  /** Empties the buffer. */
  function resetQuestions(): void {
    questions.value = [];
  }

  /** Keeps the first `length` buffered questions and drops the rest. */
  function truncateQuestions(length: number): void {
    questions.value = questions.value.slice(0, length);
  }

  /** Replaces the whole buffer with the given questions. */
  function replaceQuestions(updatedQuestions: Question[]): void {
    questions.value = updatedQuestions;
  }
  return {
    questions,
    fetchStatus,
    /** True while the random-questions fetch is in flight. */
    isPending,
    /** True when the last random-questions fetch succeeded. */
    isSuccess,
    /** True when the last random-questions fetch failed. */
    isError,
    fetchAndAppendRandomQuestions,
    resetQuestions,
    truncateQuestions,
    replaceQuestions,
    /** Fetches questions by id without touching the buffer and returns the discriminated result. */
    fetchQuestionsByIds,
    fetchQuestionsByIdsStatus,
    /** True while the by-ids fetch is in flight. */
    isFetchingQuestionsByIds,
  };
});