import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import type { $Fetch } from "nitropack";

import { GOAT_IT_API_CLIENT_FETCH_OPTIONS, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";

type QuestionThemesRepository = (fetch: $Fetch) => {
  /** Fetches question themes through `GET /api/goat-it-api/question-themes`, forwarding `query` unchanged. */
  getAll: (query?: FindQuestionThemesQueryDto) => Promise<QuestionTheme[]>;
};

/**
 * Creates the repository for the internal question-theme proxy routes.
 *
 * Rejected requests propagate to the caller, which normalizes them through `useAsyncAction`.
 *
 * @param fetch - Request-aware fetch instance, usually `useRequestFetch()`.
 */
export const questionThemesRepository: QuestionThemesRepository = (fetch: $Fetch) => ({
  async getAll(query?: FindQuestionThemesQueryDto): Promise<QuestionTheme[]> {
    return fetch<QuestionTheme[]>(`${GOAT_IT_API_PROXY_PATH_PREFIX}question-themes`, { ...GOAT_IT_API_CLIENT_FETCH_OPTIONS, query });
  },
});

export type {
  QuestionThemesRepository,
};