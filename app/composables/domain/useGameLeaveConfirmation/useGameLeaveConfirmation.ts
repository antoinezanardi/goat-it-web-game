import { LazyConfirmDialog } from "#components";

import type { UseGameLeaveConfirmation, UseGameLeaveConfirmationOptions } from "@/composables/domain/useGameLeaveConfirmation/use-game-leave-confirmation.types";

function useGameLeaveConfirmation(options: UseGameLeaveConfirmationOptions): UseGameLeaveConfirmation {
  const overlay = useOverlay();
  const { t } = useI18n();
  const isLeaveConfirmationOpen = ref<boolean>(false);

  async function confirmLeave(): Promise<boolean> {
    isLeaveConfirmationOpen.value = true;

    try {
      const modal = overlay.create(LazyConfirmDialog, {
        destroyOnClose: true,
        props: {
          disableShortcuts: true,
          dismissible: false,
          icon: "i-lucide-log-out",
          iconClass: "text-warning",
          title: t("game.leaveConfirmTitle"),
          description: t("game.leaveConfirmDescription"),
          primaryButtonLabel: t("game.leave"),
        },
      });

      return await modal.open();
    } finally {
      isLeaveConfirmationOpen.value = false;
    }
  }

  onBeforeRouteLeave(async() => {
    if (options.gameState.value !== "playing") {
      return true;
    }
    return confirmLeave();
  });

  return { isLeaveConfirmationOpen };
}

export { useGameLeaveConfirmation };