import type { FindQuestionsQueryDto } from "@goat-it/schemas/question";
import type { $Fetch } from "nitropack";

type QuestionsRepository = (fetch: $Fetch) => {
  getRandom: (query?: FindQuestionsQueryDto) => Promise<Question[]>;
};

export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getRandom(query?: FindQuestionsQueryDto): Promise<Question[]> {
    return fetch<Question[]>("/api/goat-it-api/questions/random", { query });
  },
});

export type {
  QuestionsRepository,
};