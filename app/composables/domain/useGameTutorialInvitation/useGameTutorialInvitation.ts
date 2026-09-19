import type { Toast } from "#ui/composables";
import { CookieNames } from "#shared/enums/cookie.enums";
import type { GamePageState } from "~/composables/domain/useGame/useGame";
import {
  GAME_TUTORIAL_INVITATION_DECISION_COOKIE_OPTIONS,
  GAME_TUTORIAL_INVITATION_TOAST_ID,
} from "~/composables/domain/useGameTutorialInvitation/use-game-tutorial-invitation.constants";
import type {
  GameTutorialInvitationOptions,
  UseGameTutorialInvitation,
} from "~/composables/domain/useGameTutorialInvitation/use-game-tutorial-invitation.types";

function preventDismissal(event: Event): void {
  event.preventDefault();
}

function useGameTutorialInvitation(options: GameTutorialInvitationOptions): UseGameTutorialInvitation {
  const { addInfoToast, removeToast, updateToast } = useAppToast();
  const { locale, t } = useI18n();
  const decisionCookie = useCookie<boolean>(CookieNames.GAME_TUTORIAL_INVITATION_DECIDED, GAME_TUTORIAL_INVITATION_DECISION_COOKIE_OPTIONS);

  const hasPresentedInvitation = ref<boolean>(false);
  const isInvitationResolved = ref<boolean>(false);
  const canPresentInvitation = ref<boolean>(false);
  const invitationToastId = ref<string | number | undefined>(undefined);

  function hasActiveInvitation(): boolean {
    return invitationToastId.value !== undefined && !isInvitationResolved.value;
  }

  function buildInvitationOptions(): Omit<Partial<Toast>, "id"> {
    return {
      title: t("game.interactiveTutorial.invitation.title"),
      description: t("game.interactiveTutorial.invitation.description"),
      duration: 0,
      close: false,
      actions: [
        {
          label: t("game.interactiveTutorial.invitation.start"),
          disabled: !options.isTutorialAvailable.value,
          onClick: handleStart,
        },
        {
          label: t("game.interactiveTutorial.invitation.notNow"),
          color: "neutral",
          onClick: handleNotNow,
        },
      ],
      onEscapeKeyDown: preventDismissal,
      onSwipeEnd: preventDismissal,
    };
  }

  function removeInvitation(): void {
    if (invitationToastId.value === undefined) {
      return;
    }
    removeToast(invitationToastId.value);
    invitationToastId.value = undefined;
  }

  function persistDecisionAndRemoveInvitation(): void {
    isInvitationResolved.value = true;
    decisionCookie.value = true;
    removeInvitation();
  }

  function presentInvitation(): void {
    hasPresentedInvitation.value = true;
    const invitationToast = addInfoToast({
      id: GAME_TUTORIAL_INVITATION_TOAST_ID,
      ...buildInvitationOptions(),
    });
    invitationToastId.value = invitationToast.id;
  }

  function updateInvitation(toastId: string | number): void {
    updateToast(toastId, buildInvitationOptions());
  }

  function observeInvitation(isTutorialAvailable: boolean, gameState: GamePageState): void {
    if (gameState === "game-over") {
      removeInvitation();

      return;
    }
    const toastId = invitationToastId.value;

    if (toastId !== undefined) {
      updateInvitation(toastId);

      return;
    }
    if (isTutorialAvailable && !hasPresentedInvitation.value && !decisionCookie.value) {
      presentInvitation();
    }
  }

  function handleStart(): void {
    if (!options.isTutorialAvailable.value || !hasActiveInvitation()) {
      return;
    }
    persistDecisionAndRemoveInvitation();
    options.onStartTutorial();
  }

  function handleNotNow(): void {
    if (!hasActiveInvitation()) {
      return;
    }
    persistDecisionAndRemoveInvitation();
    addInfoToast({ description: t("game.interactiveTutorial.invitation.sidebarAvailable") });
  }

  function acceptFromSidebar(): void {
    if (!hasActiveInvitation()) {
      return;
    }
    persistDecisionAndRemoveInvitation();
  }

  watch([options.isTutorialAvailable, options.gameState, locale], ([isTutorialAvailable, gameState]) => {
    if (!canPresentInvitation.value) {
      return;
    }
    observeInvitation(isTutorialAvailable, gameState);
  }, { immediate: true });

  onMounted(() => {
    canPresentInvitation.value = true;
    observeInvitation(options.isTutorialAvailable.value, options.gameState.value);
  });

  onUnmounted(() => {
    removeInvitation();
  });

  return { acceptFromSidebar };
}

export { useGameTutorialInvitation };