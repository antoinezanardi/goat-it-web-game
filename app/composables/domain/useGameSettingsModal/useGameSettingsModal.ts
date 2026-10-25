import type { UseGameSettingsModal } from "@/composables/domain/useGameSettingsModal/use-game-settings-modal.types";

/**
 * Controls the game-settings modal.
 *
 * Opening is deferred to the next render tick instead of setting the flag synchronously.
 */
function useGameSettingsModal(): UseGameSettingsModal {
  const isSettingsModalOpen = ref<boolean>(false);

  async function openSettingsModal(): Promise<void> {
    await nextTick();
    isSettingsModalOpen.value = true;
  }

  function setSettingsModalOpen(isOpen: boolean): void {
    isSettingsModalOpen.value = isOpen;
  }
  return {
    isSettingsModalOpen,
    openSettingsModal,
    setSettingsModalOpen,
  };
}

export { useGameSettingsModal };