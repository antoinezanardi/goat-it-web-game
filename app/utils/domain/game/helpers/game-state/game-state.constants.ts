import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

const TERMINAL_GAME_STATES: Set<GamePageState> = new Set(["game-over", "error", "no-matching-filters-questions"]);

export { TERMINAL_GAME_STATES };