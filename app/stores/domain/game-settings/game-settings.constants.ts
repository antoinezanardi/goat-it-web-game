// Acceptable as oxlint misreports zod's `.catch()` field-level default as promise chaining
// oxlint-disable promise/prefer-await-to-then unicorn/prefer-top-level-await

import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { z } from "zod";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

const GAME_SETTINGS_SCHEMA = z.object({
  isAdultContentEnabled: z.boolean().catch(false),
  cognitiveDifficulties: z.enum(QUESTION_COGNITIVE_DIFFICULTIES).array().catch([...QUESTION_COGNITIVE_DIFFICULTIES]),
});

const GAME_SETTINGS_DEFAULTS: GameSettings = {
  isAdultContentEnabled: false,
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
};

export { GAME_SETTINGS_DEFAULTS, GAME_SETTINGS_SCHEMA };