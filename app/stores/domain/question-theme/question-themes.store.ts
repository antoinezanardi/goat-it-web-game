import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import { DEFAULT_QUESTION_THEME_STATUS } from "@goat-it/schemas/question-theme";

import type { AsyncResult } from "#shared/types/async-result.types";
import type { AsyncDataRequestStatus } from "#app";
import { GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS } from "#shared/constants/goat-it-api.constants";
import type { QuestionThemeCatalogStatus } from "@/stores/domain/question-theme/question-themes.types";

/**
 * Owns the question-theme catalog fetched from the API and the state derived from it.
 *
 * The catalog is the source of the active/available state; consumers change it only through the fetch actions.
 */
export const useQuestionThemesStore = defineStore(StoreNames.QUESTION_THEMES, () => {
  /** Catalog as last stored, including archived themes. */
  const questionThemes = ref<QuestionTheme[]>([]);
  /** Themes whose status is active, in catalog order. */
  const activeQuestionThemes = computed<QuestionTheme[]>(() => questionThemes.value.filter(theme => theme.status === DEFAULT_QUESTION_THEME_STATUS));
  /** Ids of the active themes, in catalog order. */
  const activeQuestionThemeIds = computed<string[]>(() => activeQuestionThemes.value.map(theme => theme.id));
  /** True when at least one active theme is available. */
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

  /** Read-only view of the raw catalog fetch status. */
  const fetchStatus = computed<AsyncDataRequestStatus>(() => questionThemesFetchStatus.value);

  /** Derives the catalog lifecycle from availability and the raw fetch state. */
  const catalogStatus = computed<QuestionThemeCatalogStatus>(() => {
    if (isThemesCatalogAvailable.value) {
      if (isPending.value) {
        return "refreshing";
      }
      return isError.value ? "stale" : "ready";
    }
    return isPending.value || isIdle.value ? "loading" : "unavailable";
  });

  /**
   * Fetches the catalog and replaces the stored catalog only when the request succeeds.
   *
   * Forwards `query` to the API and returns the discriminated result; the stored catalog is kept on failure.
   */
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
    /** True while the raw catalog fetch is in flight. */
    isPending,
    /** True when the last raw catalog fetch succeeded. */
    isSuccess,
    /** True when the last raw catalog fetch failed. */
    isError,
    /** Fetches the catalog and returns the result without storing it. */
    fetchQuestionThemes,
    fetchAndStoreQuestionThemes,
  };
});