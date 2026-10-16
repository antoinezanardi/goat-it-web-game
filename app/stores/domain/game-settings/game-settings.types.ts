import type { z } from "zod";

import type { GAME_SETTINGS_SCHEMA } from "~/stores/domain/game-settings/game-settings.constants";

type GameSettings = z.infer<typeof GAME_SETTINGS_SCHEMA>;

export type { GameSettings };