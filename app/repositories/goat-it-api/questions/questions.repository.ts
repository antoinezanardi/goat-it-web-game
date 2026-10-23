import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

import { FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";
import type { GoatItApiRequestOptions } from "@/repositories/goat-it-api/goat-it-api.types";

type QuestionsRepository = (fetch: $Fetch) => {
  getByIds: (ids: string[], options?: GoatItApiRequestOptions) => Promise<Question[]>;
  getRandom: (body?: FindRandomQuestionsBodyDto, options?: GoatItApiRequestOptions) => Promise<Question[]>;
};

export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[], options?: GoatItApiRequestOptions): Promise<Question[]> {
    return fetch<Question[]>(`${GOAT_IT_API_PROXY_PATH_PREFIX}questions`, {
      ...options,
      query: { ids, limit: FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM },
    });
  },
  async getRandom(body?: FindRandomQuestionsBodyDto, options?: GoatItApiRequestOptions): Promise<Question[]> {
    return fetch<Question[]>(`${GOAT_IT_API_PROXY_PATH_PREFIX}questions/search/random`, {
      ...options,
      method: "POST",
      body,
    });
  },
});

export type {
  QuestionsRepository,
};