import type { FindQuestionsQueryDto } from "@goat-it/schemas/question";

const GAME_PREFETCH_THRESHOLD = 0.8;
const GAME_PREFETCH_BATCH_SIZE = 25;
const GAME_DEFAULT_FETCH_QUERY: FindQuestionsQueryDto = {
  "sort-by": "createdAt",
  "sort-order": "desc",
  "limit": GAME_PREFETCH_BATCH_SIZE,
};

export { GAME_DEFAULT_FETCH_QUERY, GAME_PREFETCH_BATCH_SIZE, GAME_PREFETCH_THRESHOLD };