import type { Ref } from "vue";

import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

type GameTutorialInvitationOptions = {
  /** Disables the Start action and blocks starting the tutorial while false. */
  isTutorialAvailable: Readonly<Ref<boolean>>;
  gameState: Readonly<Ref<GamePageState>>;
  /** Called after the Start action persists the decision cookie. */
  onStartTutorial: () => void;
};

/**
 * Sidebar hook returned by `useGameTutorialInvitation`.
 */
type UseGameTutorialInvitation = {
  /** Resolves the pending invitation without the companion toast; no-op when no invitation is active. */
  acceptFromSidebar: () => void;
};

export type {
  GameTutorialInvitationOptions,
  UseGameTutorialInvitation,
};