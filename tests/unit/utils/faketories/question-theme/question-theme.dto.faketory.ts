import { faker } from "@faker-js/faker";
import { QUESTION_THEME_STATUSES } from "@goat-it/schemas/question-theme";
import type { QuestionThemeDto } from "@goat-it/schemas/question-theme";

function createFakeQuestionThemeDto(questionThemeDto: Partial<QuestionThemeDto> = {}): QuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    color: faker.color.rgb({ casing: "upper" }),
    label: faker.word.sample(),
    aliases: [faker.word.sample(), faker.word.sample()],
    description: faker.word.words(3),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...questionThemeDto,
  };
}

export {
  createFakeQuestionThemeDto,
};