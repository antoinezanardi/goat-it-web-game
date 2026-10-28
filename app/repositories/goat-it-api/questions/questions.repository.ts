import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

import { FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";
import { QUESTIONS_SCHEMA } from "#shared/schemas/question/question.schemas";
import type { GoatItApiRequestOptions } from "@/repositories/goat-it-api/goat-it-api.types";

type QuestionsRepository = (fetch: $Fetch) => {
  /**
   * Fetches questions by id through `GET /api/goat-it-api/questions`, always requesting the maximum limit and forwarding `options.signal`.
   */
  getByIds: (ids: string[], options?: GoatItApiRequestOptions) => Promise<Question[]>;
  /** Fetches random questions through `POST /api/goat-it-api/questions/search/random`, forwarding `options.signal`. */
  getRandom: (body?: FindRandomQuestionsBodyDto, options?: GoatItApiRequestOptions) => Promise<Question[]>;
};

/**
 * Creates the repository for the internal question proxy routes.
 *
 * Rejected requests propagate to the caller, which normalizes them through `useAsyncAction`.
 *
 * Responses are parsed against the shared domain schema, so a malformed payload throws a `ZodError`.
 *
 * @param fetch - Request-aware fetch instance, usually `useRequestFetch()`.
 */
export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[], options?: GoatItApiRequestOptions): Promise<Question[]> {
    const rawData = await fetch<unknown>(`${GOAT_IT_API_PROXY_PATH_PREFIX}questions`, {
      ...options,
      query: { ids, limit: FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM },
    });

    return QUESTIONS_SCHEMA.parse(rawData);
  },
  async getRandom(body?: FindRandomQuestionsBodyDto, options?: GoatItApiRequestOptions): Promise<Question[]> {
    const rawData = await fetch<unknown>(`${GOAT_IT_API_PROXY_PATH_PREFIX}questions/search/random`, {
      ...options,
      method: "POST",
      body,
    });

    return QUESTIONS_SCHEMA.parse(rawData);
  },
});

export type {
  QuestionsRepository,
};