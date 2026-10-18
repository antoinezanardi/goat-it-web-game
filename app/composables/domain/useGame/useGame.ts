import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types";
import { useGameQuestionFeed } from "@/composables/domain/useGameQuestionFeed/useGameQuestionFeed";
import { useGameSettingsSync } from "@/composables/domain/useGameSettingsSync/useGameSettingsSync";
import type { GamePageState, UseGame } from "@/composables/domain/useGame/use-game.types";

function useGame(): UseGame {
  const store = useGameStore();
  const { questions, isPending, isFetchingQuestionsByIds } = storeToRefs(store);

  const currentIndex = ref<number>(0);
  const canGoToPreviousQuestion = computed<boolean>(() => currentIndex.value > 0);

  const feed = useGameQuestionFeed({ currentIndex });
  const settingsSync = useGameSettingsSync({ restartFromCurrentIndex: feed.restartFromCurrentIndex });
  const { isExhausted } = feed;

  const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);
  const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && !isExhausted.value);
  const isOutOfQuestionsLoading = computed<boolean>(() => currentIndex.value >= questions.value.length && isPending.value && !isExhausted.value);
  const isGameOver = computed<boolean>(() => isExhausted.value && currentIndex.value >= questions.value.length);

  const gameState = computed<GamePageState>(() => {
    if (isInitialLoading.value || isOutOfQuestionsLoading.value) {
      return "loading";
    }
    if (isGameOver.value) {
      return "game-over";
    }
    return "playing";
  });

  const canTranslateQuestions = computed<boolean>(() => gameState.value === "playing" && questions.value.length > 0 && !isPending.value && !isFetchingQuestionsByIds.value);
  const { isTranslating } = useGameQuestionTranslation(questions, canTranslateQuestions);
  const isFetchingQuestions = computed<boolean>(() => isPending.value || isFetchingQuestionsByIds.value);

  async function initialize(): Promise<void> {
    settingsSync.markFetchFiltersApplied();
    await feed.initialize();
  }

  function goToPreviousQuestion(): void {
    if (canGoToPreviousQuestion.value) {
      currentIndex.value--;
    }
  }

  function advanceToNextQuestion(): void {
    if (!isGameOver.value) {
      currentIndex.value++;
    }
  }

  onBeforeMount(() => {
    store.resetQuestions();
  });

  onMounted(() => {
    void initialize();
  });

  return {
    canGoToPreviousQuestion,
    currentIndex,
    currentQuestion,
    isFetchingQuestions,
    isTranslating,
    questions,
    syncQuestionsWithGameSettings: settingsSync.syncQuestionsWithGameSettings,
    advanceToNextQuestion,
    goToPreviousQuestion,
    initialize,
    gameState,
  };
}

export { useGame };