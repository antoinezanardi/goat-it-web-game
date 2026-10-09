import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import { until } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { isEqual } from "radashi";

import type { Question } from "#shared/types/question.types";
import type { GameSettingsFetchFilters } from "~/composables/domain/useGame/use-game.types";
import { GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY, GAME_PREFETCH_THRESHOLD } from "@/pages/(game)/game.constants";

type GamePageState = "loading" | "playing" | "game-over";

type UseGame = {
  canGoToPreviousQuestion: ComputedRef<boolean>;
  currentIndex: Ref<number>;
  currentQuestion: ComputedRef<Question | undefined>;
  isFetchingQuestions: ComputedRef<boolean>;
  isTranslating: ComputedRef<boolean>;
  questions: Ref<Question[]>;
  syncQuestionsWithGameSettings: () => Promise<void>;
  advanceToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  initialize: () => Promise<void>;
  gameState: ComputedRef<GamePageState>;
};

function useGame(): UseGame {
  const store = useGameStore();
  const { questions, isError, isPending, isFetchingQuestionsByIds } = storeToRefs(store);
  const settingsStore = useGameSettingsStore();
  const questionThemesStore = useQuestionThemesStore();

  const currentIndex = ref<number>(0);
  const canGoToPreviousQuestion = computed<boolean>(() => currentIndex.value > 0);
  const isExhausted = ref<boolean>(false);
  const hasTriggeredPrefetch = ref<boolean>(false);

  function getGameSettingsFetchFilters(): GameSettingsFetchFilters {
    const filters: GameSettingsFetchFilters = {};
    if (!settingsStore.settings.isAdultContentEnabled) {
      filters.isAdultContent = false;
    }
    const selectedCognitiveDifficulties = [...new Set(settingsStore.settings.cognitiveDifficulties)];
    if (selectedCognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length) {
      filters.cognitiveDifficulties = selectedCognitiveDifficulties;
    }
    const selectedCategories = QUESTION_CATEGORIES.filter(category => settingsStore.settings.categories.includes(category));
    if (selectedCategories.length < QUESTION_CATEGORIES.length) {
      filters.categories = selectedCategories;
    }
    const activeThemeIds = questionThemesStore.activeQuestionThemeIds;
    const savedThemeIds = [...new Set(settingsStore.settings.themeIds)];
    if (activeThemeIds.length > 0) {
      const activeSelection = activeThemeIds.filter(themeId => savedThemeIds.includes(themeId));
      if (activeSelection.length > 0 && activeSelection.length < activeThemeIds.length) {
        filters.themeIds = activeSelection;
      }
    } else if (savedThemeIds.length > 0) {
      filters.themeIds = savedThemeIds;
    }
    return filters;
  }

  const appliedFetchFilters = ref<GameSettingsFetchFilters>(getGameSettingsFetchFilters());

  const randomQuestionsRequestBody = computed<FindRandomQuestionsBodyDto>(() => {
    if (questions.value.length === 0) {
      return {
        ...GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY,
        ...getGameSettingsFetchFilters(),
      };
    }
    return {
      limit: GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY.limit,
      excludedIds: questions.value.map(question => question.id),
      ...getGameSettingsFetchFilters(),
    };
  });

  const currentQuestion = computed<Question | undefined>(() => questions.value[currentIndex.value]);
  const isInitialLoading = computed<boolean>(() => questions.value.length === 0 && !isExhausted.value);
  const isOutOfQuestionsLoading = computed<boolean>(() => currentIndex.value >= questions.value.length && isPending.value && !isExhausted.value);
  const isGameOver = computed<boolean>(() => isExhausted.value && currentIndex.value >= questions.value.length);
  const prefetchThreshold = computed<number>(() => Math.floor(questions.value.length * GAME_PREFETCH_THRESHOLD));

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
    appliedFetchFilters.value = getGameSettingsFetchFilters();
    await store.fetchAndAppendRandomQuestions(randomQuestionsRequestBody.value);
    if (questions.value.length === 0) {
      isExhausted.value = true;
    }
  }

  onBeforeMount(() => {
    store.resetQuestions();
  });

  onMounted(() => {
    void initialize();
  });

  watch(currentIndex, async index => {
    if (index < prefetchThreshold.value || isPending.value || isExhausted.value || hasTriggeredPrefetch.value) {
      return;
    }

    hasTriggeredPrefetch.value = true;
    const lengthBefore = questions.value.length;
    await store.fetchAndAppendRandomQuestions(randomQuestionsRequestBody.value);
    if (questions.value.length === lengthBefore) {
      isExhausted.value = true;
    }
  });

  watch(isPending, pending => {
    if (!pending) {
      hasTriggeredPrefetch.value = false;
    }
  });

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

  async function syncQuestionsWithGameSettings(): Promise<void> {
    const currentFetchFilters = getGameSettingsFetchFilters();
    if (isEqual(currentFetchFilters, appliedFetchFilters.value)) {
      return;
    }
    await until(isPending).toBe(false);
    store.truncateQuestions(currentIndex.value + 1);
    isExhausted.value = false;
    hasTriggeredPrefetch.value = false;
    appliedFetchFilters.value = currentFetchFilters;
    const lengthBefore = questions.value.length;
    await store.fetchAndAppendRandomQuestions(randomQuestionsRequestBody.value);
    if (!isError.value && questions.value.length === lengthBefore) {
      isExhausted.value = true;
    }
  }

  watch(() => questionThemesStore.activeQuestionThemeIds, async() => {
    await syncQuestionsWithGameSettings();
  });

  return {
    canGoToPreviousQuestion,
    currentIndex,
    currentQuestion,
    isFetchingQuestions,
    isTranslating,
    questions,
    syncQuestionsWithGameSettings,
    advanceToNextQuestion,
    goToPreviousQuestion,
    initialize,
    gameState,
  };
}

export type { GamePageState, UseGame };

export { useGame };