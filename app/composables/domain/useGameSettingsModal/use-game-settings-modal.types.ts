/**
 * Settings-modal state and controls returned by `useGameSettingsModal`.
 */
type UseGameSettingsModal = {
  isSettingsModalOpen: Ref<boolean>;
  openSettingsModal: () => Promise<void>;
  /** Mirrors open and close events coming from the modal itself. */
  setSettingsModalOpen: (isOpen: boolean) => void;
};

export type { UseGameSettingsModal };