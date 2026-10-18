import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

const GAME_PREFETCH_THRESHOLD = 0.8;
const GAME_EXCLUDED_IDS_MAXIMUM = 1000;

const GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY = {
  limit: 25,
} as const satisfies FindRandomQuestionsBodyDto;

export {
  GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY,
  GAME_EXCLUDED_IDS_MAXIMUM,
  GAME_PREFETCH_THRESHOLD,
};