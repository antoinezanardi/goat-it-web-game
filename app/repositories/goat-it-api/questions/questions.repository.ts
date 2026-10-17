import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

import { FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM, GOAT_IT_API_CLIENT_FETCH_OPTIONS, GOAT_IT_API_PROXY_PATH_PREFIX } from "#shared/constants/goat-it-api.constants";

type QuestionsRepository = (fetch: $Fetch) => {
  getByIds: (ids: string[]) => Promise<Question[]>;
  getRandom: (body?: FindRandomQuestionsBodyDto) => Promise<Question[]>;
};

export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[]): Promise<Question[]> {
    return fetch<Question[]>(`${GOAT_IT_API_PROXY_PATH_PREFIX}questions`, {
      ...GOAT_IT_API_CLIENT_FETCH_OPTIONS,
      query: { ids, limit: FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM },
    });
  },
  async getRandom(body?: FindRandomQuestionsBodyDto): Promise<Question[]> {
    return fetch<Question[]>(`${GOAT_IT_API_PROXY_PATH_PREFIX}questions/search/random`, {
      ...GOAT_IT_API_CLIENT_FETCH_OPTIONS,
      method: "POST",
      body,
    });
  },
});

export type {
  QuestionsRepository,
};