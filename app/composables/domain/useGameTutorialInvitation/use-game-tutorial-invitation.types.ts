import type { Ref } from "vue";

import type { GamePageState } from "~/composables/domain/useGame/useGame";

type GameTutorialInvitationOptions = {
  isTutorialAvailable: Readonly<Ref<boolean>>;
  gameState: Readonly<Ref<GamePageState>>;
  onStartTutorial: () => void;
};

type UseGameTutorialInvitation = {
  acceptFromSidebar: () => void;
};

export type {
  GameTutorialInvitationOptions,
  UseGameTutorialInvitation,
};