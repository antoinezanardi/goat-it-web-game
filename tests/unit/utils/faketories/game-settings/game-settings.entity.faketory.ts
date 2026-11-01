import { faker } from "@faker-js/faker";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

function createFakeGameSettings(gameSettings: Partial<GameSettings> = {}): GameSettings {
  return {
    isAdultContentEnabled: faker.datatype.boolean(),
    cognitiveDifficulties: faker.helpers.arrayElements([...QUESTION_COGNITIVE_DIFFICULTIES]),
    categories: faker.helpers.arrayElements([...QUESTION_CATEGORIES]),
    themeIds: faker.helpers.arrayElements(Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.string.uuid())),
    ...gameSettings,
  };
}

export {
  createFakeGameSettings,
};