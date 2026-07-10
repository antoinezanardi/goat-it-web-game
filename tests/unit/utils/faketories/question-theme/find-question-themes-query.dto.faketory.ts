import { faker } from "@faker-js/faker";
import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";

import { FIND_QUERY_UNBOUNDED_LIMIT } from "#server/utils/goat-it-api/goat-it-api.constants";

function createFakeFindQuestionThemesQueryDto(query: Partial<FindQuestionThemesQueryDto> = {}): FindQuestionThemesQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement(["slug", "createdAt", "updatedAt"]),
    "sort-order": faker.helpers.arrayElement(["asc", "desc"]),
    "limit": faker.number.int({ min: FIND_QUERY_UNBOUNDED_LIMIT, max: 100 }),
    ...query,
  };
}

export {
  createFakeFindQuestionThemesQueryDto,
};