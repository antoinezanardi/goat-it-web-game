import { FIND_QUERY_UNBOUNDED_LIMIT } from "#shared/constants/goat-it-api.constants";

function clampFindQueryLimit(limit: number, maximum: number): number {
  return limit === FIND_QUERY_UNBOUNDED_LIMIT ? maximum : Math.min(limit, maximum);
}

export { clampFindQueryLimit };