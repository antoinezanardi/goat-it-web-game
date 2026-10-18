import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import { storeToRefs } from "pinia";

import { useGameFetchFilters } from "@/composables/domain/useGameFetchFilters/useGameFetchFilters";
import { buildExcludedQuestionIds } from "@/composables/domain/useGameQuestionFeed/helpers/game-excluded-ids/game-excluded-ids.helpers";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY, GAME_EXCLUDED_IDS_MAXIMUM, GAME_PREFETCH_THRESHOLD } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.constants";
import type { UseGameQuestionFeed, UseGameQuestionFeedOptions } from "@/composables/domain/useGameQuestionFeed/use-game-question-feed.types";

function useGameQuestionFeed(options: UseGameQuestionFeedOptions): UseGameQuestionFeed {
  const store = useGameStore();
  const { questions, isPending } = storeToRefs(store);
  const { fetchFilters } = useGameFetchFilters();
  const { handleGoatItApiError } = useGoatItApiErrorToast();
  const { t } = useI18n();

  const isExhausted = ref<boolean>(false);
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
    const result = await store.fetchAndAppendRandomQuestions(buildRandomQuestionsRequestBody());
    if (!result.ok) {
      handleGoatItApiError(result.error, t("questions.cantFetch"));

      return false;
    }
    return true;
  }

  async function initialize(): Promise<void> {
    await fetchNextBatch();
    if (questions.value.length === 0) {
      isExhausted.value = true;
    }
  }

  async function restartFromCurrentIndex(): Promise<void> {
    store.truncateQuestions(options.currentIndex.value + 1);
    isExhausted.value = false;
    hasTriggeredPrefetch.value = false;
    const lengthBefore = questions.value.length;
    const isFetchSuccessful = await fetchNextBatch();
    if (isFetchSuccessful && questions.value.length === lengthBefore) {
      isExhausted.value = true;
    }
  }

  watch(options.currentIndex, async index => {
    if (index < prefetchThreshold.value || isPending.value || isExhausted.value || hasTriggeredPrefetch.value) {
      return;
    }

    hasTriggeredPrefetch.value = true;
    const lengthBefore = questions.value.length;
    await fetchNextBatch();
    if (questions.value.length === lengthBefore) {
      isExhausted.value = true;
    }
  });

  watch(isPending, pending => {
    if (!pending) {
      hasTriggeredPrefetch.value = false;
    }
  });

  return {
    questions,
    isExhausted,
    initialize,
    restartFromCurrentIndex,
  };
}

export { useGameQuestionFeed };