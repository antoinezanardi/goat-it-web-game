import { faker } from "@faker-js/faker";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

function createFakeGameSettings(gameSettings: Partial<GameSettings> = {}): GameSettings {
  return {
    isAdultContentEnabled: faker.datatype.boolean(),
    ...gameSettings,
  };
}

export {
  createFakeGameSettings,
};