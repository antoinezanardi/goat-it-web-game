import { FIND_QUERY_UNBOUNDED_LIMIT } from "#shared/constants/goat-it-api.constants";

/**
 * Caps a find-query `limit`, treating the `0` sentinel as unbounded and therefore equal to `maximum`.
 */
function clampFindQueryLimit(limit: number, maximum: number): number {
  return limit === FIND_QUERY_UNBOUNDED_LIMIT ? maximum : Math.min(limit, maximum);
}

export { clampFindQueryLimit };