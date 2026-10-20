import type { GamePageState } from "@/composables/domain/useGame/use-game.types";
import { TERMINAL_GAME_STATES } from "@/utils/domain/game/helpers/game-state/game-state.constants";

function isGameInTerminalState(gameState: GamePageState): boolean {
  return TERMINAL_GAME_STATES.has(gameState);
}

export { isGameInTerminalState };