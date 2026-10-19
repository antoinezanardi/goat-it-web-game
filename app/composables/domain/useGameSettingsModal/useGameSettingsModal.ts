import { nextTick } from "vue";

import type { UseGameSettingsModal } from "@/composables/domain/useGameSettingsModal/use-game-settings-modal.types";

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