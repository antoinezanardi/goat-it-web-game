import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

type QuestionsRepository = (fetch: $Fetch) => {
  getByIds: (ids: string[]) => Promise<Question[]>;
  getRandom: (body?: FindRandomQuestionsBodyDto) => Promise<Question[]>;
};

export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[]): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions", { query: { ids } });
  },
  async getRandom(body?: FindRandomQuestionsBodyDto): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions/search/random", { method: "POST", body });
  },
});

export type {
  QuestionsRepository,
};