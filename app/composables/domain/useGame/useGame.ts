import { storeToRefs } from "pinia";

import type { Question } from "#shared/types/question.types";
import { GAME_SETTINGS_RESET_TOAST_ID } from "@/composables/domain/useGame/use-game.constants";
import type { GamePageState, UseGame } from "@/composables/domain/useGame/use-game.types";
import { useGameQuestionFeed } from "@/composables/domain/useGameQuestionFeed/useGameQuestionFeed";
import { useGameSettingsSync } from "@/composables/domain/useGameSettingsSync/useGameSettingsSync";

function useGame(): UseGame {
  const store = useGameStore();
  const gameSettingsStore = useGameSettingsStore();
  const { addWarningToast } = useAppToast();
  const { t } = useI18n();
  const { questions, isPending, isFetchingQuestionsByIds } = storeToRefs(store);

  const currentIndex = ref<number>(0);
  const canGoToPreviousQuestion = computed<boolean>(() => currentIndex.value > 0);

  const feed = useGameQuestionFeed({ currentIndex });
  const settingsSync = useGameSettingsSync({ restartFromCurrentIndex: feed.restartFromCurrentIndex });
  const { hasFetchError, isEmptyWithFilters, isExhausted } = feed;

  const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);
  const hasPlayableQuestion = computed<boolean>(() => currentIndex.value < questions.value.length);
  const isFetchError = computed<boolean>(() => hasFetchError.value && !hasPlayableQuestion.value && !isPending.value);
  const isEmptyFilters = computed<boolean>(() => isEmptyWithFilters.value && !hasPlayableQuestion.value && !isPending.value);
  const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && !isExhausted.value && !isFetchError.value && !isEmptyFilters.value);
  const isOutOfQuestionsLoading = computed<boolean>(() => !hasPlayableQuestion.value && isPending.value && !isExhausted.value && !isFetchError.value && !isEmptyFilters.value);
  const isGameOver = computed<boolean>(() => isExhausted.value && !hasPlayableQuestion.value);

  const gameState = computed<GamePageState>(() => {
    if (isFetchError.value) {
      return "error";
    }
    if (isEmptyFilters.value) {
      return "empty-filters";
    }
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

  async function retry(): Promise<void> {
    await feed.retry();
  }

  async function resetFilters(): Promise<void> {
    gameSettingsStore.resetSettings();
    settingsSync.markFetchFiltersApplied();
    await feed.restartFromCurrentIndex();
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
    if (gameSettingsStore.wasGameSettingsReset) {
      addWarningToast({ id: GAME_SETTINGS_RESET_TOAST_ID, description: t("game.settings.resetNotice") });
      gameSettingsStore.acknowledgeSettingsReset();
    }
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
    resetFilters,
    retry,
    gameState,
  };
}

export { useGame };