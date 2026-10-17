import { describe, it, expect } from "vitest";

import { FIND_QUERY_UNBOUNDED_LIMIT } from "#shared/constants/goat-it-api.constants";
import { clampFindQueryLimit } from "#server/utils/goat-it-api/helpers/find-query-limit.helpers";

describe(clampFindQueryLimit, () => {
  it.each<{ providedLimit: number; maximum: number; expectedLimit: number }>([
    { providedLimit: FIND_QUERY_UNBOUNDED_LIMIT, maximum: 100, expectedLimit: 100 },
    { providedLimit: 5, maximum: 100, expectedLimit: 5 },
    { providedLimit: 100, maximum: 100, expectedLimit: 100 },
    { providedLimit: 5000, maximum: 100, expectedLimit: 100 },
    { providedLimit: FIND_QUERY_UNBOUNDED_LIMIT, maximum: 200, expectedLimit: 200 },
    { providedLimit: 250, maximum: 200, expectedLimit: 200 },
  ])("should return $expectedLimit when the limit is $providedLimit with a maximum of $maximum.", ({ providedLimit, maximum, expectedLimit }) => {
    expect(clampFindQueryLimit(providedLimit, maximum)).toBe(expectedLimit);
  });
});