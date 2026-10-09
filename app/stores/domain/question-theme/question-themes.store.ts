import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import { DEFAULT_QUESTION_THEME_STATUS } from "@goat-it/schemas/question-theme";

import type { QuestionThemeCatalogStatus } from "~/stores/domain/question-theme/question-theme-catalog.types";

export const useQuestionThemesStore = defineStore(StoreNames.QUESTION_THEMES, () => {
  const questionThemes = ref<QuestionTheme[]>([]);
  const questionThemeSlugs = computed<string[]>(() => questionThemes.value.map(theme => theme.slug));
  const activeQuestionThemes = computed<QuestionTheme[]>(() => questionThemes.value.filter(theme => theme.status === DEFAULT_QUESTION_THEME_STATUS));
  const activeQuestionThemeIds = computed<string[]>(() => activeQuestionThemes.value.map(theme => theme.id));

  const repository = questionThemesRepository($fetch);
  const { handleGoatItApiError } = useGoatItApiErrorToast();
  const { t } = useI18n();

  const {
    execute: fetchQuestionThemes,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
  } = useAsyncAction(
    repository.getAll,
    (thrownError: unknown) => handleGoatItApiError(thrownError, t("questionThemes.cantFetch")),
  );

  const catalogStatus = computed<QuestionThemeCatalogStatus>(() => {
    if (activeQuestionThemes.value.length > 0) {
      if (isPending.value) {
        return "refreshing";
      }
      return isError.value ? "stale" : "ready";
    }
    return isPending.value || !isError.value ? "loading" : "unavailable";
  });

  async function fetchAndStoreQuestionThemes(query?: FindQuestionThemesQueryDto): Promise<void> {
    const fetchedQuestionThemes = await fetchQuestionThemes(query);
    if (fetchedQuestionThemes) {
      questionThemes.value = fetchedQuestionThemes;
    }
  }
  return {
    questionThemes,
    questionThemeSlugs,
    activeQuestionThemes,
    activeQuestionThemeIds,
    catalogStatus,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
    fetchQuestionThemes,
    fetchAndStoreQuestionThemes,
  };
});