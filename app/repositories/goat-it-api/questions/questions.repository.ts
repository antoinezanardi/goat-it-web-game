import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

import { FIND_QUERY_UNBOUNDED_LIMIT } from "#shared/constants/goat-it-api.constants";

type QuestionsRepository = (fetch: $Fetch) => {
  getByIds: (ids: string[]) => Promise<Question[]>;
  getRandom: (body?: FindRandomQuestionsBodyDto) => Promise<Question[]>;
};

export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[]): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions", { query: { ids, limit: FIND_QUERY_UNBOUNDED_LIMIT } });
  },
  async getRandom(body?: FindRandomQuestionsBodyDto): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions/search/random", { method: "POST", body });
  },
});

export type {
  QuestionsRepository,
};