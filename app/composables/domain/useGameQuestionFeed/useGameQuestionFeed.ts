import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import { useNetwork } from "@vueuse/core";
import { storeToRefs } from "pinia";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { Question } from "#shared/types/question.types";
import { useGameFetchFilters } from "@/composables/domain/useGameFetchFilters/useGameFetchFilters";
import { isConfirmedOfflineFetchError } from "@/composables/domain/useGameQuestionFeed/helpers/confirmed-offline-fetch-error/confirmed-offline-fetch-error.helpers";
import { buildExcludedQuestionIds } from "@/composables/domain/useGameQuestionFeed/helpers/game-excluded-ids/game-excluded-ids.helpers";
import { hasNarrowingQuestionFilters } from "@/composables/domain/useGameQuestionFeed/helpers/narrowing-question-filters/narrowing-question-filters.helpers";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY, GAME_EXCLUDED_IDS_MAXIMUM, GAME_PREFETCH_THRESHOLD } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.constants";
import type { UseGameQuestionFeed, UseGameQuestionFeedOptions } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.types";

/**
 * Buffers random questions for the game and keeps the buffer supplied as the player advances.
 *
 * The first request sends only the current filters; later requests add the newest ids as `excludedIds`,
 * deduplicated and capped at `GAME_EXCLUDED_IDS_MAXIMUM`. An empty batch means exhaustion unless a narrowing
 * filter is active, in which case it is reported as `hasNoMatchingFiltersQuestions`. A new batch is fetched once
 * the current index reaches 80% of the buffer, and a restart truncates the buffer to `currentIndex + 1`.
 *
 * @example
 * const currentIndex = ref(0);
 * const feed = useGameQuestionFeed({ currentIndex });
 * await feed.initialize();
 * // `feed.questions` grows as the player advances
 */
function useGameQuestionFeed(options: UseGameQuestionFeedOptions): UseGameQuestionFeed {
  const store = useGameStore();
  const { questions, isPending } = storeToRefs(store);
  const { fetchFilters } = useGameFetchFilters();
  const { handleGoatItApiError } = useGoatItApiErrorToast();
  const { t } = useI18n();
  const { isOnline } = useNetwork();

  const isExhausted = ref<boolean>(false);
  const hasNoMatchingFiltersQuestions = ref<boolean>(false);
  const hasFetchError = ref<boolean>(false);
  const hasTriggeredPrefetch = ref<boolean>(false);
  const prefetchThreshold = computed<number>(() => Math.floor(questions.value.length * GAME_PREFETCH_THRESHOLD));

  function buildRandomQuestionsRequestBody(): FindRandomQuestionsBodyDto {
    if (questions.value.length === 0) {
      return {
        ...GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY,
        ...fetchFilters.value,
      };
    }
    return {
      limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
      excludedIds: buildExcludedQuestionIds(questions.value, GAME_EXCLUDED_IDS_MAXIMUM),
      ...fetchFilters.value,
    };
  }

  async function fetchNextBatch(): Promise<AsyncResult<Question[]>> {
    const requestBody = buildRandomQuestionsRequestBody();
    const result = await store.fetchAndAppendRandomQuestions(requestBody);
    if (!result.ok) {
      hasFetchError.value = true;
      if (!isConfirmedOfflineFetchError(result.error, isOnline.value)) {
        handleGoatItApiError(result.error, { title: t("questions.cantFetch"), context: "questions" });
      }
      return { ok: false, error: result.error };
    }
    hasFetchError.value = false;
    const hasNewQuestions = result.value.length > 0;
    if (hasNewQuestions) {
      isExhausted.value = false;
      hasNoMatchingFiltersQuestions.value = false;

      return { ok: true, value: result.value };
    }
    const isEmpty = hasNarrowingQuestionFilters(requestBody);

    isExhausted.value = !isEmpty;
    hasNoMatchingFiltersQuestions.value = isEmpty;

    return { ok: true, value: result.value };
  }

  async function initialize(): Promise<void> {
    await retryQuestionFetch();
  }

  async function restartFromCurrentIndex(): Promise<AsyncResult<Question[]>> {
    store.truncateQuestions(options.currentIndex.value + 1);
    isExhausted.value = false;
    hasNoMatchingFiltersQuestions.value = false;
    hasTriggeredPrefetch.value = false;

    return fetchNextBatch();
  }

  async function retryQuestionFetch(): Promise<void> {
    isExhausted.value = false;
    hasNoMatchingFiltersQuestions.value = false;
    await fetchNextBatch();
  }

  watch(options.currentIndex, async index => {
    if (index < prefetchThreshold.value || isPending.value || isExhausted.value || hasNoMatchingFiltersQuestions.value || hasTriggeredPrefetch.value) {
      return;
    }

    hasTriggeredPrefetch.value = true;
    await fetchNextBatch();
  });

  watch(isPending, pending => {
    if (!pending) {
      hasTriggeredPrefetch.value = false;
    }
  });

  return {
    questions,
    isExhausted,
    hasNoMatchingFiltersQuestions,
    hasFetchError,
    initialize,
    restartFromCurrentIndex,
    retryQuestionFetch,
  };
}

export { useGameQuestionFeed };