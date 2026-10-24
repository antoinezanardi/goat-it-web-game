import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

type UseGameLeaveConfirmationOptions = {
  /** Only `"playing"` triggers the guard; other states allow the route change immediately. */
  gameState: ComputedRef<GamePageState>;
};

/**
 * Leave-confirmation state returned by `useGameLeaveConfirmation`.
 */
type UseGameLeaveConfirmation = {
  /** True while the confirmation overlay is open; the guard awaits the player's choice before it resets. */
  isLeaveConfirmationOpen: Ref<boolean>;
};

export type { UseGameLeaveConfirmation, UseGameLeaveConfirmationOptions };