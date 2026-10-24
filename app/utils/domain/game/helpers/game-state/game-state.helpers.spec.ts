import { describe, expect, it } from "vitest";

import { isGameInTerminalState } from "@/utils/domain/game/helpers/game-state/game-state.helpers";
import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

describe(isGameInTerminalState, () => {
  it.each<{ gameState: GamePageState }>([
    { gameState: "game-over" },
    { gameState: "error" },
    { gameState: "no-matching-filters-questions" },
  ])("should return true when the game state is $gameState.", ({ gameState }) => {
    expect(isGameInTerminalState(gameState)).toBe(true);
  });

  it.each<{ gameState: GamePageState }>([
    { gameState: "loading" },
    { gameState: "playing" },
  ])("should return false when the game state is $gameState.", ({ gameState }) => {
    expect(isGameInTerminalState(gameState)).toBe(false);
  });
});