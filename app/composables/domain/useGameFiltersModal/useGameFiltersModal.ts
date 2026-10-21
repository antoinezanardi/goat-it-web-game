import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";
import type { UseGameFiltersModal, UseGameFiltersModalOptions } from "@/composables/domain/useGameFiltersModal/use-game-filters-modal.types";

function useGameFiltersModal(options: UseGameFiltersModalOptions): UseGameFiltersModal {
  const gameSettingsStore = useGameSettingsStore();
  const { addSuccessToast } = useAppToast();
  const { t } = useI18n();

  const isFiltersModalOpen = ref<boolean>(false);
  const isFiltersModalOpenRequested = ref<boolean>(false);
  const isApplyFiltersPending = ref<boolean>(false);

  function openFiltersModal(): void {
    isFiltersModalOpen.value = true;
  }

  function setFiltersModalOpen(isOpen: boolean): void {
    isFiltersModalOpen.value = isOpen;
  }

  function requestFiltersModalFromSidebar(): void {
    isFiltersModalOpenRequested.value = true;
  }

  async function openRequestedFiltersModal(): Promise<void> {
    if (!isFiltersModalOpenRequested.value) {
      return;
    }
    isFiltersModalOpenRequested.value = false;
    const playHighlight = options.getFiltersButton()?.playHighlight;
    if (playHighlight) {
      await playHighlight();
    }
    openFiltersModal();
  }

  async function applyFilters(draft: GameQuestionsFiltersDraft): Promise<void> {
    gameSettingsStore.setAdultContentEnabled(draft.isAdultContentEnabled);
    gameSettingsStore.setCognitiveDifficulties(draft.cognitiveDifficulties);
    gameSettingsStore.setCategories(draft.categories);
    if (draft.themeIds !== undefined) {
      gameSettingsStore.setThemeIds(draft.themeIds);
    }
    isFiltersModalOpen.value = false;
    isApplyFiltersPending.value = true;
    try {
      const result = await options.syncQuestionsWithGameSettings();

      if (result.ok) {
        addSuccessToast({ description: t("game.questionsFilters.successToast") });
      }
    } finally {
      isApplyFiltersPending.value = false;
    }
  }
  return {
    isFiltersModalOpen,
    isApplyFiltersPending,
    openFiltersModal,
    setFiltersModalOpen,
    requestFiltersModalFromSidebar,
    openRequestedFiltersModal,
    applyFilters,
  };
}

export { useGameFiltersModal };