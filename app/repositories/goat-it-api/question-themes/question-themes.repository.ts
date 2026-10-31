import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";
import type { $Fetch } from "nitropack";

import { GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";
import { QUESTION_THEMES_SCHEMA } from "#shared/schemas/question-theme/question-theme.schemas";
import type { GoatItApiRequestOptions } from "@/repositories/goat-it-api/goat-it-api.types";

type QuestionThemesRepository = (fetch: $Fetch) => {
  /**
   * Fetches question themes through `GET /api/goat-it-api/question-themes`, forwarding `query` and `options.signal` unchanged.
   */
  getAll: (query?: FindQuestionThemesQueryDto, options?: GoatItApiRequestOptions) => Promise<QuestionTheme[]>;
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
  async getAll(query?: FindQuestionThemesQueryDto, options?: GoatItApiRequestOptions): Promise<QuestionTheme[]> {
    const rawData = await fetch<unknown>(`${GOAT_IT_API_PROXY_PATH_PREFIX}question-themes`, { ...options, query });

    return QUESTION_THEMES_SCHEMA.parse(rawData);
  },
});

export type {
  QuestionThemesRepository,
};