import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import { DEFAULT_QUESTION_THEME_STATUS } from "@goat-it/schemas/question-theme";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { AsyncDataRequestStatus } from "#app";
import { GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS } from "#shared/constants/goat-it-api.constants";
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
  } = useAsyncAction(async({ signal }, query?: FindQuestionThemesQueryDto) => repository.getAll(query, { signal }), GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS);

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

  async function fetchAndStoreQuestionThemes(query?: FindQuestionThemesQueryDto): Promise<AsyncResult<QuestionTheme[]>> {
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