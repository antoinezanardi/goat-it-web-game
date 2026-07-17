import type { FindRandomQuestionsQueryDto } from "@goat-it/schemas/question";

const GAME_PAGE_TITLE_KEY = "game.pageTitle";
const GAME_PREFETCH_THRESHOLD = 0.8;
const GAME_FETCH_RANDOM_QUESTIONS_LIMIT = 25;

const GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY = {
  limit: GAME_FETCH_RANDOM_QUESTIONS_LIMIT,
} as const satisfies FindRandomQuestionsQueryDto;

export {
  GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_QUERY,
  GAME_PAGE_TITLE_KEY,
  GAME_FETCH_RANDOM_QUESTIONS_LIMIT,
  GAME_PREFETCH_THRESHOLD,
};