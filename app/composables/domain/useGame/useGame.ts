import { storeToRefs } from "pinia";
import type { FindRandomQuestionsQueryDto } from "@goat-it/schemas/question";

import type { Question } from "#shared/types/question.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY, GAME_PREFETCH_THRESHOLD } from "@/pages/(game)/game.constants";

type UseGame = {
  currentQuestion: ComputedRef<Question | undefined>;
  advanceToNextQuestion: () => void;
  isInitialLoading: ComputedRef<boolean>;
  isOutOfQuestionsLoading: ComputedRef<boolean>;
  isGameOver: ComputedRef<boolean>;
};

function useGame(): UseGame {
  const store = useGameStore();
  const { questions, isPending } = storeToRefs(store);

  const currentIndex = ref<number>(0);
  const isExhausted = ref<boolean>(false);
  const hasTriggeredPrefetch = ref<boolean>(false);

  const playedQuestionIds = computed<string[]>(() => questions.value.slice(0, currentIndex.value).map(question => question.id));

  const excludedIdsQuery = computed<FindRandomQuestionsQueryDto>(() => {
    if (playedQuestionIds.value.length === 0) {
      return GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY;
    }
    // Acceptable as the schema handles comma-separated strings at runtime, but the DTO type only models string[]
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return {
      "limit": GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY.limit,
      "excluded-ids": playedQuestionIds.value.join(","),
    } as unknown as FindRandomQuestionsQueryDto;
  });

  const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);
  const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && isPending.value);
  const isOutOfQuestionsLoading = computed<boolean>(() => currentIndex.value >= questions.value.length && isPending.value && !isExhausted.value);
  const isGameOver = computed<boolean>(() => isExhausted.value && currentIndex.value >= questions.value.length);
  const prefetchThreshold = computed<number>(() => Math.floor(questions.value.length * GAME_PREFETCH_THRESHOLD));

  void callOnce(async() => {
    await store.fetchAndAppendRandomQuestions(excludedIdsQuery.value);
    if (questions.value.length === 0) {
      isExhausted.value = true;
    }
  });

  watch(currentIndex, async index => {
    if (index >= prefetchThreshold.value && !isPending.value && !isExhausted.value && !hasTriggeredPrefetch.value) {
      hasTriggeredPrefetch.value = true;
      const lengthBefore = questions.value.length;
      await store.fetchAndAppendRandomQuestions(excludedIdsQuery.value);
      if (questions.value.length === lengthBefore) {
        isExhausted.value = true;
      }
    }
  });

  watch(isPending, pending => {
    if (!pending) {
      hasTriggeredPrefetch.value = false;
    }
  });

  function advanceToNextQuestion(): void {
    if (!isGameOver.value) {
      currentIndex.value++;
    }
  }
  return {
    currentQuestion,
    advanceToNextQuestion,
    isInitialLoading,
    isOutOfQuestionsLoading,
    isGameOver,
  };
}

export type { UseGame };

export { useGame };