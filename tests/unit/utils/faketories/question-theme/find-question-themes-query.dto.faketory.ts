import { faker } from "@faker-js/faker";
import type { FindQuestionThemesQueryDto } from "@goat-it/schemas/question-theme";

function createFakeFindQuestionThemesQueryDto(query: Partial<FindQuestionThemesQueryDto> = {}): FindQuestionThemesQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement(["slug", "createdAt", "updatedAt"]),
    "sort-order": faker.helpers.arrayElement(["asc", "desc"]),
    "limit": faker.number.int({ min: 1, max: 100 }),
    ...query,
  };
}

export {
  createFakeFindQuestionThemesQueryDto,
};