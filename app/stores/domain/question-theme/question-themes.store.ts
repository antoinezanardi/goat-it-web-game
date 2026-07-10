import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";

export const useQuestionThemesStore = defineStore(StoreNames.QUESTION_THEMES, () => {
  const questionThemes = ref<QuestionTheme[]>([]);
  const questionThemeSlugs = computed<string[]>(() => questionThemes.value.map(theme => theme.slug));

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

  async function fetchAndStoreQuestionThemes(query?: FindQuestionThemesQueryDto): Promise<void> {
    const fetchedQuestionThemes = await fetchQuestionThemes(query);
    if (fetchedQuestionThemes) {
      questionThemes.value = fetchedQuestionThemes;
    }
  }
  return {
    questionThemes,
    questionThemeSlugs,
    fetchStatus,
    isPending,
    isSuccess,
    isError,
    fetchQuestionThemes,
    fetchAndStoreQuestionThemes,
  };
});