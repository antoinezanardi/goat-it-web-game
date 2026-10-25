import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import type { $Fetch } from "nitropack";

import { GOAT_IT_API_CLIENT_FETCH_OPTIONS, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";
import { QUESTION_THEMES_SCHEMA } from "#shared/schemas/question-theme/question-theme.schemas";

type QuestionThemesRepository = (fetch: $Fetch) => {
  /** Fetches question themes through `GET /api/goat-it-api/question-themes`, forwarding `query` unchanged. */
  getAll: (query?: FindQuestionThemesQueryDto) => Promise<QuestionTheme[]>;
};

/**
 * Creates the repository for the internal question-theme proxy routes.
 *
 * Rejected requests propagate to the caller, which normalizes them through `useAsyncAction`.
 *
 * Responses are parsed against the shared domain schema, so a malformed payload throws a `ZodError`.
 *
 * @param fetch - Request-aware fetch instance, usually `useRequestFetch()`.
 */
export const questionThemesRepository: QuestionThemesRepository = (fetch: $Fetch) => ({
  async getAll(query?: FindQuestionThemesQueryDto): Promise<QuestionTheme[]> {
    const rawData = await fetch<unknown>(`${GOAT_IT_API_PROXY_PATH_PREFIX}question-themes`, { ...GOAT_IT_API_CLIENT_FETCH_OPTIONS, query });

    return QUESTION_THEMES_SCHEMA.parse(rawData);
  },
});

export type {
  QuestionThemesRepository,
};