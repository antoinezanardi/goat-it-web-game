// Acceptable as oxlint misreports zod's `.catch()` field-level default as promise chaining
// oxlint-disable promise/prefer-await-to-then unicorn/prefer-top-level-await

import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { z } from "zod";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

const GAME_SETTINGS_SCHEMA = z.object({
  isAdultContentEnabled: z.boolean().catch(false),
  cognitiveDifficulties: z.enum(QUESTION_COGNITIVE_DIFFICULTIES)
    .array()
    .transform(difficulties => QUESTION_COGNITIVE_DIFFICULTIES.filter(difficulty => difficulties.includes(difficulty)))
    .refine(difficulties => difficulties.length > 0)
    .catch([...QUESTION_COGNITIVE_DIFFICULTIES]),
  categories: z.enum(QUESTION_CATEGORIES)
    .array()
    .transform(categories => QUESTION_CATEGORIES.filter(category => categories.includes(category)))
    .refine(categories => categories.length > 0)
    .catch([...QUESTION_CATEGORIES]),
  themeIds: z.array(z.string())
    .transform(themeIds => (themeIds.length > 0 ? [...new Set(themeIds)] : undefined))
    .optional()
    // Acceptable as removing the explicit argument makes oxlint's promise/valid-params misfire on zod's `.catch()`
    // oxlint-disable-next-line unicorn/no-useless-undefined
    .catch(undefined),
});

const GAME_SETTINGS_STORED_SCHEMA = z.object({
  isAdultContentEnabled: GAME_SETTINGS_SCHEMA.shape.isAdultContentEnabled.unwrap().optional(),
  cognitiveDifficulties: GAME_SETTINGS_SCHEMA.shape.cognitiveDifficulties.unwrap().optional(),
  categories: GAME_SETTINGS_SCHEMA.shape.categories.unwrap().optional(),
  themeIds: GAME_SETTINGS_SCHEMA.shape.themeIds.unwrap().optional(),
});

const GAME_SETTINGS_DEFAULTS: GameSettings = {
  isAdultContentEnabled: false,
  cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
  categories: [...QUESTION_CATEGORIES],
};

export { GAME_SETTINGS_DEFAULTS, GAME_SETTINGS_SCHEMA, GAME_SETTINGS_STORED_SCHEMA };