import type { z } from "zod";

import type { GAME_SETTINGS_SCHEMA } from "@/stores/domain/game-settings/game-settings.constants";

/**
 * Game settings serialized in the `game_settings` cookie and validated by `GAME_SETTINGS_SCHEMA`.
 *
 * Invalid or missing stored values fall back field by field: `isAdultContentEnabled` becomes `false`,
 * `cognitiveDifficulties` and `categories` fall back to every accepted value, and `themeIds` becomes
 * `undefined` when empty. Enum arrays are normalized to the canonical schema order and `themeIds` is
 * deduplicated; an undefined `themeIds` means no theme filter.
 */
type GameSettings = z.infer<typeof GAME_SETTINGS_SCHEMA>;

export type { GameSettings };