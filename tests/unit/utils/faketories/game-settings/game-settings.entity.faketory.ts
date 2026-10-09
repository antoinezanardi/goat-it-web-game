import { faker } from "@faker-js/faker";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

function createFakeGameSettings(gameSettings: Partial<GameSettings> = {}): GameSettings {
  return {
    isAdultContentEnabled: faker.datatype.boolean(),
    cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
    categories: [...QUESTION_CATEGORIES],
    themeIds: [],
    ...gameSettings,
  };
}

export {
  createFakeGameSettings,
};