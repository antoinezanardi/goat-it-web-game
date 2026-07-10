import { faker } from "@faker-js/faker";
import type { FindQuestionsQueryDto } from "@goat-it/schemas/question";

import { FIND_QUERY_UNBOUNDED_LIMIT } from "#server/utils/goat-it-api/goat-it-api.constants";

function createFakeFindQuestionsQueryDto(query: Partial<FindQuestionsQueryDto> = {}): FindQuestionsQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement(["createdAt", "updatedAt", "category", "cognitiveDifficulty"]),
    "sort-order": faker.helpers.arrayElement(["asc", "desc"]),
    "limit": faker.number.int({ min: FIND_QUERY_UNBOUNDED_LIMIT, max: 100 }),
    ...query,
  };
}

export {
  createFakeFindQuestionsQueryDto,
};