import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import { storeToRefs } from "pinia";

import { useGameFetchFilters } from "@/composables/domain/useGameFetchFilters/useGameFetchFilters";
import { buildExcludedQuestionIds } from "@/composables/domain/useGameQuestionFeed/helpers/game-excluded-ids/game-excluded-ids.helpers";
import { hasNarrowingQuestionFilters } from "@/composables/domain/useGameQuestionFeed/helpers/narrowing-question-filters/narrowing-question-filters.helpers";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY, GAME_EXCLUDED_IDS_MAXIMUM, GAME_PREFETCH_THRESHOLD } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.constants";
import type { UseGameQuestionFeed, UseGameQuestionFeedOptions } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.types";

function useGameQuestionFeed(options: UseGameQuestionFeedOptions): UseGameQuestionFeed {
  const store = useGameStore();
  const { questions, isPending } = storeToRefs(store);
  const { fetchFilters } = useGameFetchFilters();
  const { handleGoatItApiError } = useGoatItApiErrorToast();
  const { t } = useI18n();

  const isExhausted = ref<boolean>(false);
  const isEmptyWithFilters = ref<boolean>(false);
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

  async function fetchNextBatch(): Promise<boolean> {
    const requestBody = buildRandomQuestionsRequestBody();
    const result = await store.fetchAndAppendRandomQuestions(requestBody);
    if (!result.ok) {
      hasFetchError.value = true;
      handleGoatItApiError(result.error, t("questions.cantFetch"), "questions");

      return false;
    }
    hasFetchError.value = false;
    const hasNewQuestions = result.value.length > 0;
    if (hasNewQuestions) {
      isExhausted.value = false;
      isEmptyWithFilters.value = false;

      return true;
    }
    const isEmpty = hasNarrowingQuestionFilters(requestBody);

    isExhausted.value = !isEmpty;
    isEmptyWithFilters.value = isEmpty;

    return true;
  }

  async function initialize(): Promise<void> {
    isExhausted.value = false;
    isEmptyWithFilters.value = false;
    await fetchNextBatch();
  }

  async function restartFromCurrentIndex(): Promise<boolean> {
    store.truncateQuestions(options.currentIndex.value + 1);
    isExhausted.value = false;
    isEmptyWithFilters.value = false;
    hasTriggeredPrefetch.value = false;

    return fetchNextBatch();
  }

  async function retry(): Promise<void> {
    isExhausted.value = false;
    isEmptyWithFilters.value = false;
    await fetchNextBatch();
  }

  watch(options.currentIndex, async index => {
    if (index < prefetchThreshold.value || isPending.value || isExhausted.value || hasTriggeredPrefetch.value) {
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
    isEmptyWithFilters,
    hasFetchError,
    initialize,
    restartFromCurrentIndex,
    retry,
  };
}

export { useGameQuestionFeed };