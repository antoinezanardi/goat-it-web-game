import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

type UseGameLeaveConfirmationOptions = {
  gameState: ComputedRef<GamePageState>;
};

type UseGameLeaveConfirmation = {
  isLeaveConfirmationOpen: Ref<boolean>;
};

export type { UseGameLeaveConfirmation, UseGameLeaveConfirmationOptions };