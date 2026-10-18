import { QUESTION_CATEGORIES } from "@goat-it/schemas/question";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";

import type { useGameFiltersModal as UseGameFiltersModalType } from "@/composables/domain/useGameFiltersModal/useGameFiltersModal";
import type { UseGameSettingsCookie } from "@/composables/domain/useGameSettingsCookie/use-game-settings-cookie.types";
import { GAME_SETTINGS_DEFAULTS } from "@/stores/domain/game-settings/game-settings.constants";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";

type FiltersButtonHandle = { playHighlight: () => Promise<void> };

let useAppToastMock: UseAppToastMock;
let useGameFiltersModal: typeof UseGameFiltersModalType;
let getFiltersButton: Mock<() => FiltersButtonHandle | undefined>;
let syncQuestionsWithGameSettings: Mock<() => Promise<void>>;

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);

mockNuxtImport("useGameSettingsCookie", () => (): UseGameSettingsCookie => ({
  readGameSettingsCookie: (): GameSettings => GAME_SETTINGS_DEFAULTS,
  writeGameSettingsCookie: vi.fn<UseGameSettingsCookie["writeGameSettingsCookie"]>(),
}));

function createDraft(overrides: Partial<GameQuestionsFiltersDraft> = {}): GameQuestionsFiltersDraft {
  return {
    isAdultContentEnabled: true,
    cognitiveDifficulties: ["easy"],
    categories: [...QUESTION_CATEGORIES],
    ...overrides,
  };
}

function createDeferredPromise(): { promise: Promise<void>; resolve: () => void } {
  let resolveSynchronization: () => void = () => undefined;
  const promise: Promise<void> = new Promise(resolve => {
    resolveSynchronization = resolve;
  });

  return { promise, resolve: resolveSynchronization };
}

describe("useGameFiltersModal", () => {
  beforeEach(async() => {
    useAppToastMock = createUseAppToastMock();
    getFiltersButton = vi.fn<() => FiltersButtonHandle | undefined>().mockReturnValue(undefined);
    syncQuestionsWithGameSettings = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    createTestingPinia();
    ({ useGameFiltersModal } = await import("@/composables/domain/useGameFiltersModal/useGameFiltersModal"));
  });

  describe("modal open state", () => {
    it("should expose the filters modal as closed when created.", () => {
      const { isFiltersModalOpen } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      expect(isFiltersModalOpen.value).toBe(false);
    });

    it("should open the filters modal when openFiltersModal is called.", () => {
      const { isFiltersModalOpen, openFiltersModal } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      openFiltersModal();

      expect(isFiltersModalOpen.value).toBe(true);
    });

    it.each<{ isOpen: boolean }>([
      { isOpen: true },
      { isOpen: false },
    ])("should set the filters modal open state to $isOpen when setFiltersModalOpen is called.", ({ isOpen }) => {
      const { isFiltersModalOpen, setFiltersModalOpen } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      setFiltersModalOpen(isOpen);

      expect(isFiltersModalOpen.value).toBe(isOpen);
    });
  });

  describe("openRequestedFiltersModal", () => {
    it("should not open the filters modal when no filters request was made.", async() => {
      const { isFiltersModalOpen, openRequestedFiltersModal } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await openRequestedFiltersModal();

      expect(isFiltersModalOpen.value).toBe(false);
    });

    it("should open the filters modal when a filters request was made before the sidebar left.", async() => {
      const { isFiltersModalOpen, openRequestedFiltersModal, requestFiltersModalFromSidebar } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      requestFiltersModalFromSidebar();
      await openRequestedFiltersModal();

      expect(isFiltersModalOpen.value).toBe(true);
    });

    it("should not reopen the filters modal when the pending request was already consumed.", async() => {
      const {
        isFiltersModalOpen,
        openRequestedFiltersModal,
        requestFiltersModalFromSidebar,
        setFiltersModalOpen,
      } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      requestFiltersModalFromSidebar();
      await openRequestedFiltersModal();
      setFiltersModalOpen(false);
      await openRequestedFiltersModal();

      expect(isFiltersModalOpen.value).toBe(false);
    });

    it("should play the trigger highlight when the sidebar leaves after a filters request.", async() => {
      const playHighlight = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
      getFiltersButton.mockReturnValue({ playHighlight });
      const { openRequestedFiltersModal, requestFiltersModalFromSidebar } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      requestFiltersModalFromSidebar();
      await openRequestedFiltersModal();

      expect(playHighlight).toHaveBeenCalledExactlyOnceWith();
    });

    it("should open the filters modal without a trigger highlight when no filters button is available.", async() => {
      const { isFiltersModalOpen, openRequestedFiltersModal, requestFiltersModalFromSidebar } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      requestFiltersModalFromSidebar();
      await openRequestedFiltersModal();

      expect(isFiltersModalOpen.value).toBe(true);
    });

    it("should keep the filters modal closed when the trigger highlight promise has not settled.", async() => {
      const deferredHighlight = createDeferredPromise();
      const playHighlight = vi.fn<() => Promise<void>>().mockReturnValue(deferredHighlight.promise);
      getFiltersButton.mockReturnValue({ playHighlight });
      const { isFiltersModalOpen, openRequestedFiltersModal, requestFiltersModalFromSidebar } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      requestFiltersModalFromSidebar();
      const openPromise = openRequestedFiltersModal();
      const isOpenBeforeSettle = isFiltersModalOpen.value;
      deferredHighlight.resolve();
      await openPromise;

      expect(isOpenBeforeSettle).toBe(false);
    });

    it("should open the filters modal when the trigger highlight promise settles.", async() => {
      const deferredHighlight = createDeferredPromise();
      const playHighlight = vi.fn<() => Promise<void>>().mockReturnValue(deferredHighlight.promise);
      getFiltersButton.mockReturnValue({ playHighlight });
      const { isFiltersModalOpen, openRequestedFiltersModal, requestFiltersModalFromSidebar } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      requestFiltersModalFromSidebar();
      const openPromise = openRequestedFiltersModal();
      deferredHighlight.resolve();
      await openPromise;

      expect(isFiltersModalOpen.value).toBe(true);
    });
  });

  describe("applyFilters", () => {
    it("should commit the applied adult content value to the game settings store when the draft is applied.", async() => {
      const gameSettingsStore = mockStore(useGameSettingsStore);
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft({ isAdultContentEnabled: true }));

      expect(gameSettingsStore.setAdultContentEnabled).toHaveBeenCalledExactlyOnceWith(true);
    });

    it("should commit the applied cognitive difficulties to the game settings store when the draft is applied.", async() => {
      const gameSettingsStore = mockStore(useGameSettingsStore);
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft({ cognitiveDifficulties: ["easy"] }));

      expect(gameSettingsStore.setCognitiveDifficulties).toHaveBeenCalledExactlyOnceWith(["easy"]);
    });

    it("should commit the applied categories to the game settings store when the draft is applied.", async() => {
      const gameSettingsStore = mockStore(useGameSettingsStore);
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft({ categories: ["trivia"] }));

      expect(gameSettingsStore.setCategories).toHaveBeenCalledExactlyOnceWith(["trivia"]);
    });

    it("should commit the applied theme ids to the game settings store when theme ids are provided.", async() => {
      const gameSettingsStore = mockStore(useGameSettingsStore);
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft({ themeIds: ["theme-a"] }));

      expect(gameSettingsStore.setThemeIds).toHaveBeenCalledExactlyOnceWith(["theme-a"]);
    });

    it("should not commit theme ids when the applied draft has no theme ids.", async() => {
      const gameSettingsStore = mockStore(useGameSettingsStore);
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft());

      expect(gameSettingsStore.setThemeIds).not.toHaveBeenCalled();
    });

    it("should start the question synchronization when the draft is applied.", async() => {
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft());

      expect(syncQuestionsWithGameSettings).toHaveBeenCalledExactlyOnceWith();
    });

    it("should show the success toast when the draft is applied.", async() => {
      const { applyFilters } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      await applyFilters(createDraft());

      expect(useAppToastMock.addSuccessToast).toHaveBeenCalledExactlyOnceWith({ description: "game.questionsFilters.successToast" });
    });

    it("should close the filters modal when the draft is applied.", async() => {
      const { applyFilters, isFiltersModalOpen, openFiltersModal } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });
      openFiltersModal();

      await applyFilters(createDraft());

      expect(isFiltersModalOpen.value).toBe(false);
    });

    it("should expose the apply state as pending when the synchronization has not settled.", async() => {
      const deferredSynchronization = createDeferredPromise();
      syncQuestionsWithGameSettings.mockReturnValue(deferredSynchronization.promise);
      const { applyFilters, isApplyFiltersPending } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      const applyPromise = applyFilters(createDraft());
      const isPendingDuringApply = isApplyFiltersPending.value;
      deferredSynchronization.resolve();
      await applyPromise;

      expect(isPendingDuringApply).toBe(true);
    });

    it("should clear the apply state when the synchronization settles.", async() => {
      const deferredSynchronization = createDeferredPromise();
      syncQuestionsWithGameSettings.mockReturnValue(deferredSynchronization.promise);
      const { applyFilters, isApplyFiltersPending } = useGameFiltersModal({ syncQuestionsWithGameSettings, getFiltersButton });

      const applyPromise = applyFilters(createDraft());
      deferredSynchronization.resolve();
      await applyPromise;

      expect(isApplyFiltersPending.value).toBe(false);
    });
  });
});