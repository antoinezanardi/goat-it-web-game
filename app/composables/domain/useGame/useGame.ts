import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY, GAME_PREFETCH_THRESHOLD } from "@/pages/(game)/game.constants";

type UseGame = {
  currentQuestion: ComputedRef<Question | undefined>;
  advanceToNextQuestion: () => void;
  initialize: () => Promise<void>;
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

  const excludedIdsQuery = computed(() => {
    if (questions.value.length === 0) {
      return GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY;
    }
    return {
      "limit": GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY.limit,
      "excluded-ids": questions.value.map(question => question.id),
    };
  });

  const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);
  const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && isPending.value);
  const isOutOfQuestionsLoading = computed<boolean>(() => currentIndex.value >= questions.value.length && isPending.value && !isExhausted.value);
  const isGameOver = computed<boolean>(() => isExhausted.value && currentIndex.value >= questions.value.length);
  const prefetchThreshold = computed<number>(() => Math.floor(questions.value.length * GAME_PREFETCH_THRESHOLD));

  async function initialize(): Promise<void> {
    await store.fetchAndAppendRandomQuestions(excludedIdsQuery.value);
    if (questions.value.length === 0) {
      isExhausted.value = true;
    }
  }

  onMounted(() => {
    void initialize();
  });

  watch(currentIndex, async index => {
    if (index < prefetchThreshold.value) {
      return;
    }
    if (isPending.value) {
      return;
    }
    if (isExhausted.value) {
      return;
    }
    if (hasTriggeredPrefetch.value) {
      return;
    }

    hasTriggeredPrefetch.value = true;
    const lengthBefore = questions.value.length;
    await store.fetchAndAppendRandomQuestions(excludedIdsQuery.value);
    if (questions.value.length === lengthBefore) {
      isExhausted.value = true;
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
    initialize,
    isInitialLoading,
    isOutOfQuestionsLoading,
    isGameOver,
  };
}

export type { UseGame };

export { useGame };