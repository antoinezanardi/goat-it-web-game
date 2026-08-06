import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

const GAME_PAGE_TITLE_KEY = "game.pageTitle";
const GAME_PREFETCH_THRESHOLD = 0.8;
const GAME_FETCH_RANDOM_QUESTIONS_LIMIT = 25;

const GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY = {
  limit: GAME_FETCH_RANDOM_QUESTIONS_LIMIT,
} as const satisfies FindRandomQuestionsBodyDto;

export {
  GAME_DEFAULT_FETCH_RANDOM_QUESTIONS_BODY,
  GAME_PAGE_TITLE_KEY,
  GAME_FETCH_RANDOM_QUESTIONS_LIMIT,
  GAME_PREFETCH_THRESHOLD,
};