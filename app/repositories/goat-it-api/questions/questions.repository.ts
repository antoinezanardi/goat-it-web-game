import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

import { FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM, GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS } from "#shared/constants/goat-it-api.constants";

type QuestionsRepository = (fetch: $Fetch) => {
  getByIds: (ids: string[]) => Promise<Question[]>;
  getRandom: (body?: FindRandomQuestionsBodyDto) => Promise<Question[]>;
};

export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[]): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions", {
      query: { ids, limit: FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM },
      timeout: GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS,
    });
  },
  async getRandom(body?: FindRandomQuestionsBodyDto): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions/search/random", {
      method: "POST",
      body,
      timeout: GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS,
    });
  },
});

export type {
  QuestionsRepository,
};