// Acceptable as oxlint misreports zod's `.catch()` field-level default as promise chaining
// oxlint-disable promise/prefer-await-to-then unicorn/prefer-top-level-await

import { z } from "zod";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

const GAME_SETTINGS_SCHEMA = z.object({
  isAdultContentEnabled: z.boolean().catch(false),
});

const GAME_SETTINGS_DEFAULTS: GameSettings = {
  isAdultContentEnabled: false,
};

export { GAME_SETTINGS_DEFAULTS, GAME_SETTINGS_SCHEMA };