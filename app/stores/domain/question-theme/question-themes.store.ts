import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import { DEFAULT_QUESTION_THEME_STATUS } from "@goat-it/schemas/question-theme";

import type { AsyncDataRequestStatus } from "#app";
import type { UseAsyncActionResult } from "@/composables/core/useAsyncAction/use-async-action.types";
import type { QuestionThemeCatalogStatus } from "@/stores/domain/question-theme/question-themes.types";

export const useQuestionThemesStore = defineStore(StoreNames.QUESTION_THEMES, () => {
  const questionThemes = ref<QuestionTheme[]>([]);
  const activeQuestionThemes = computed<QuestionTheme[]>(() => questionThemes.value.filter(theme => theme.status === DEFAULT_QUESTION_THEME_STATUS));
  const activeQuestionThemeIds = computed<string[]>(() => activeQuestionThemes.value.map(theme => theme.id));
  const isThemesCatalogAvailable = computed<boolean>(() => activeQuestionThemes.value.length > 0);

  const repository = questionThemesRepository(useRequestFetch());

  const {
    execute: fetchQuestionThemes,
    fetchStatus: questionThemesFetchStatus,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useAsyncAction(repository.getAll);

  const fetchStatus = computed<AsyncDataRequestStatus>(() => questionThemesFetchStatus.value);

  const catalogStatus = computed<QuestionThemeCatalogStatus>(() => {
    if (isThemesCatalogAvailable.value) {
      if (isPending.value) {
        return "refreshing";
      }
      return isError.value ? "stale" : "ready";
    }
    return isPending.value || isIdle.value ? "loading" : "unavailable";
  });

  async function fetchAndStoreQuestionThemes(query?: FindQuestionThemesQueryDto): Promise<UseAsyncActionResult<QuestionTheme[]>> {
    const result = await fetchQuestionThemes(query);
    if (result.ok) {
      questionThemes.value = result.value;
    }
    return result;
  }
  return {
    questionThemes,
    activeQuestionThemes,
    activeQuestionThemeIds,
    isThemesCatalogAvailable,
    catalogStatus,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
    fetchQuestionThemes,
    fetchAndStoreQuestionThemes,
  };
});