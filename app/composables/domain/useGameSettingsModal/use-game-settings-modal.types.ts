type UseGameSettingsModal = {
  isSettingsModalOpen: Ref<boolean>;
  openSettingsModal: () => Promise<void>;
  setSettingsModalOpen: (isOpen: boolean) => void;
};

export type { UseGameSettingsModal };