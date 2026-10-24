import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { useOverlayMock } from "~~/tests/unit/setup/nuxt/composables/use-overlay.nuxt.unit-setup";
import type { UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

import { ConfirmDialog, GameQuestionsFiltersModal } from "#components";
import type {
  DefaultModalFooter,
  UModal,
  GameQuestionsFiltersModalContent,
  GameQuestionsFiltersModalHeader,
} from "#components";

import { GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON, GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON_CLASS, GAME_QUESTIONS_FILTERS_MODAL_UI } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.constants";
import type { GameQuestionsFiltersModalProps } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.types";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

describe("GameQuestionsFiltersModal Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersModalProps: GameQuestionsFiltersModalProps = {
    isApplyFiltersPending: false,
    isFiltersModalOpen: false,
  } as const;

  const UNRESTRICTED_SETTINGS_FIELDS: Partial<GameSettings> = {
    categories: [...QUESTION_CATEGORIES],
    cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
    themeIds: undefined,
  };

  async function mountGameQuestionsFiltersModal(options: MountSuspendedOptions<typeof GameQuestionsFiltersModal> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersModal, { props: defaultGameQuestionsFiltersModalProps, global: { plugins: [createTestingPinia()] }, ...options });
  }

  function getHeader(): VueWrapper<InstanceType<typeof GameQuestionsFiltersModalHeader>> {
    return wrapper.findComponent<typeof GameQuestionsFiltersModalHeader>({ name: "GameQuestionsFiltersModalHeader" });
  }

  function getContent(): VueWrapper<InstanceType<typeof GameQuestionsFiltersModalContent>> {
    return wrapper.findComponent<typeof GameQuestionsFiltersModalContent>({ name: "GameQuestionsFiltersModalContent" });
  }

  function getFooter(): VueWrapper<InstanceType<typeof DefaultModalFooter>> {
    return wrapper.findComponent<typeof DefaultModalFooter>({ name: "DefaultModalFooter" });
  }

  function getCreatedModalInstance(): UseOverlayCreateReturnValue {
    const createResult = useOverlayMock.instance.create.mock.results[0];

    if (createResult?.type !== "return") {
      throw new Error("Expected overlay.create() to have returned a modal instance");
    }
    return createResult.value;
  }

  async function openFiltersModal(): Promise<void> {
    await wrapper.setProps({ isFiltersModalOpen: true });
    await nextTick();
    await flushPromises();
    await vi.dynamicImportSettled();
    await flushPromises();
  }

  function emitAdultContentDraft(value: boolean): void {
    getWrapperVm(getContent()).$emit("update:isAdultContentEnabled", value);
  }

  function emitCognitiveDifficultiesDraft(value: string[]): void {
    getWrapperVm(getContent()).$emit("update:cognitiveDifficulties", value);
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionsFiltersModal();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("should render GameQuestionsFiltersModal when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the modal root with the correct data-testid when opened.", async() => {
    await openFiltersModal();

    expect(document.body.querySelector("[data-testid='game-questions-filters-modal']")).not.toBeNull();
  });

  it("should pass the isFiltersModalOpen prop to UModal when opened.", async() => {
    await openFiltersModal();
    const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

    expect(modal.props("open")).toBe(true);
  });

  it("should pass the GAME_QUESTIONS_FILTERS_MODAL_UI ui config to UModal when opened.", async() => {
    await openFiltersModal();
    const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

    expect(modal.props("ui")).toStrictEqual(GAME_QUESTIONS_FILTERS_MODAL_UI);
  });

  it("should render the modal footer with the correct data-testid when opened.", async() => {
    await openFiltersModal();

    expect(wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='game-questions-filters-modal-footer']").exists()).toBe(true);
  });

  it("should pass the apply translation key as the footer primary button label when opened.", async() => {
    await openFiltersModal();

    expect(getFooter().props("primaryButtonLabel")).toBe("game.questionsFilters.apply");
  });

  it("should pass the check icon to the footer primary button when opened.", async() => {
    await openFiltersModal();

    expect(getFooter().props("primaryButtonIcon")).toBe("i-lucide-check");
  });

  it("should disable the footer shortcuts when opened.", async() => {
    await openFiltersModal();

    expect(getFooter().props("disableShortcuts")).toBe(true);
  });

  it("should pass the apply pending state as loading to the footer when it is pending.", async() => {
    await openFiltersModal();
    await wrapper.setProps({ isApplyFiltersPending: true });

    expect(getFooter().props("isPrimaryButtonLoading")).toBe(true);
  });

  it("should pass the applied count to the header when the committed settings have one active group.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
    await openFiltersModal();

    expect(getHeader().props("appliedCount")).toBe(1);
  });

  it("should keep the applied count passed to the header unchanged when the draft changes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();

    expect(getHeader().props("appliedCount")).toBe(0);
  });

  it("should pass isResetVisible as false to the header when the draft matches the defaults.", async() => {
    await openFiltersModal();

    expect(getHeader().props("isResetVisible")).toBe(false);
  });

  it("should pass isResetVisible as true to the header when the draft differs from the defaults.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();

    expect(getHeader().props("isResetVisible")).toBe(true);
  });

  it("should pass the committed adult content value to the content draft when opened.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true });
    await openFiltersModal();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: true,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: [...QUESTION_CATEGORIES],
      themeIds: undefined,
    });
  });

  it("should update the draft adult content when the content emits update:isAdultContentEnabled.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: true,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: [...QUESTION_CATEGORIES],
      themeIds: undefined,
    });
  });

  it("should update the draft cognitive difficulties when the content emits update:cognitiveDifficulties.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    emitCognitiveDifficultiesDraft(["easy"]);
    await nextTick();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy"],
      categories: [...QUESTION_CATEGORIES],
      themeIds: undefined,
    });
  });

  it("should disable the apply action when the draft matches the committed values.", async() => {
    await openFiltersModal();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should enable the apply action when the adult content draft changes.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should enable the apply action when the cognitive difficulties draft changes.", async() => {
    await openFiltersModal();
    emitCognitiveDifficultiesDraft(["easy"]);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should keep the apply action disabled when the difficulties are reordered with the same values.", async() => {
    await openFiltersModal();
    emitCognitiveDifficultiesDraft(["hard", "easy", "medium"]);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should disable the apply action when the draft is reverted to the committed values.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    emitAdultContentDraft(false);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should disable the apply action while a previous apply is pending even when the draft changed.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await wrapper.setProps({ isApplyFiltersPending: true });

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should enable the apply action when the pending state clears while the draft still differs.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await wrapper.setProps({ isApplyFiltersPending: true });
    await wrapper.setProps({ isApplyFiltersPending: false });

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should emit applyFilters with the current draft when the footer primary button is clicked.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("primaryButtonClick");

    expect(wrapper.emitted("applyFilters")).toStrictEqual([
      [
        {
          isAdultContentEnabled: true,
          cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
          categories: [...QUESTION_CATEGORIES],
          themeIds: undefined,
        },
      ],
    ]);
  });

  it.each<{ description: string; settings: Partial<GameSettings> }>([
    {
      description: "the adult content draft was enabled",
      settings: { ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: true },
    },
    {
      description: "a cognitive difficulty was selected",
      settings: { ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] },
    },
  ])("should reset the draft when $description and the header emits reset.", async({ settings }) => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings(settings);
    await openFiltersModal();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: [...QUESTION_CATEGORIES],
      themeIds: undefined,
    });
  });

  it("should not emit applyFilters when the header emits reset.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(wrapper.emitted("applyFilters")).toBeUndefined();
  });

  it("should enable the apply action when a non-default committed draft is reset to the defaults.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it.each<{ openValue: boolean; expectedEmitted: [[boolean]] }>([
    { openValue: false, expectedEmitted: [[false]] },
    { openValue: true, expectedEmitted: [[true]] },
  ])("should emit update:isFiltersModalOpen as $openValue when UModal emits update:open as $openValue.", async({ openValue, expectedEmitted }) => {
    await openFiltersModal();
    getWrapperVm(wrapper.findComponent<typeof UModal>({ name: "UModal" })).$emit("update:open", openValue);

    expect(wrapper.emitted("update:isFiltersModalOpen")).toStrictEqual(expectedEmitted);
  });

  it("should emit update:isFiltersModalOpen as false when the footer emits closeModal.", async() => {
    await openFiltersModal();
    getWrapperVm(getFooter()).$emit("closeModal");

    expect(wrapper.emitted("update:isFiltersModalOpen")).toStrictEqual([[false]]);
  });

  it("should reset the draft to the latest committed values when reopened.", async() => {
    const store = mockStore(useGameSettingsStore);
    store.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    await wrapper.setProps({ isFiltersModalOpen: false });
    store.settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: [...QUESTION_CATEGORIES],
      themeIds: undefined,
    });
  });

  it("should create the discard confirmation with the localized props when the footer close is triggered with a modified draft.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();

    expect(useOverlayMock.instance.create).toHaveBeenCalledExactlyOnceWith(
      ConfirmDialog,
      {
        destroyOnClose: true,
        props: {
          close: false,
          closeButtonLabel: "game.questionsFilters.discardBack",
          description: "game.questionsFilters.discardDescription",
          disableShortcuts: true,
          icon: GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON,
          iconClass: GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON_CLASS,
          primaryButtonLabel: "game.questionsFilters.discardClose",
          title: "game.questionsFilters.discardTitle",
        },
      },
    );
  });

  it("should close the filters modal when the discard confirmation is confirmed.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();
    getCreatedModalInstance().close(true);
    await flushPromises();

    expect(wrapper.emitted("update:isFiltersModalOpen")).toStrictEqual([[false]]);
  });

  it("should keep the filters modal open and preserve the draft when the discard confirmation is canceled.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();
    getCreatedModalInstance().close(false);
    await flushPromises();

    expect(wrapper.emitted("update:isFiltersModalOpen")).toBeUndefined();
  });

  it("should not create another discard confirmation when a close is requested while one is already pending.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();

    expect(useOverlayMock.instance.create).toHaveBeenCalledExactlyOnceWith(ConfirmDialog, expect.objectContaining({ destroyOnClose: true }));
  });

  it("should create a new discard confirmation when closing again after the previous confirmation was canceled.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();
    getCreatedModalInstance().close(false);
    await flushPromises();
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();

    expect(useOverlayMock.instance.create).toHaveBeenCalledTimes(2);
  });

  it("should create the discard confirmation when the modal requests to close with a modified draft.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(wrapper.findComponent<typeof UModal>({ name: "UModal" })).$emit("update:open", false);
    await flushPromises();

    expect(useOverlayMock.instance.create).toHaveBeenCalledExactlyOnceWith(ConfirmDialog, expect.objectContaining({ destroyOnClose: true }));
  });

  it("should not create the discard confirmation when the footer close is triggered with an unmodified draft.", async() => {
    await openFiltersModal();
    getWrapperVm(getFooter()).$emit("closeModal");

    expect(useOverlayMock.instance.create).not.toHaveBeenCalled();
  });

  it("should not create the discard confirmation when the draft is reset back to the committed values before closing.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");

    expect(useOverlayMock.instance.create).not.toHaveBeenCalled();
  });

  it("should not create the discard confirmation when the footer primary button is clicked with a modified draft.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("primaryButtonClick");

    expect(useOverlayMock.instance.create).not.toHaveBeenCalled();
  });

  it("should include the committed categories and theme ids in the content draft when opened.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({
      ...UNRESTRICTED_SETTINGS_FIELDS,
      isAdultContentEnabled: false,
      categories: ["trivia", "riddle"],
      themeIds: ["theme-a"],
    });
    await openFiltersModal();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: ["trivia", "riddle"],
      themeIds: ["theme-a"],
    });
  });

  it("should pass the active theme ids to the content when an active catalog is available.", async() => {
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await openFiltersModal();

    expect(getContent().props("activeQuestionThemeIds")).toStrictEqual(["theme-a", "theme-b"]);
  });

  it("should pass the active themes to the content when an active catalog is available.", async() => {
    const activeQuestionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" }), createFakeQuestionTheme({ id: "theme-b", status: "active" })];
    mockStore(useQuestionThemesStore).questionThemes = activeQuestionThemes;
    await openFiltersModal();

    expect(getContent().props("activeQuestionThemes")).toStrictEqual(activeQuestionThemes);
  });

  it("should pass the themes catalog availability to the content when an active catalog is available.", async() => {
    mockStore(useQuestionThemesStore).questionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" })];
    await openFiltersModal();

    expect(getContent().props("isThemesCatalogAvailable")).toBe(true);
  });

  it("should pass the ready catalog status to the content when an active catalog is available.", async() => {
    mockStore(useQuestionThemesStore).questionThemes = [createFakeQuestionTheme({ id: "theme-a", status: "active" })];
    await openFiltersModal();

    expect(getContent().props("themesCatalogStatus")).toBe("ready");
  });

  it("should update the draft categories when the content emits update:categories.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    getWrapperVm(getContent()).$emit("update:categories", ["trivia"]);
    await nextTick();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: ["trivia"],
      themeIds: undefined,
    });
  });

  it("should update the draft theme ids when the content emits update:questionThemeIds.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    getWrapperVm(getContent()).$emit("update:questionThemeIds", ["theme-a"]);
    await nextTick();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: [...QUESTION_CATEGORIES],
      themeIds: ["theme-a"],
    });
  });

  it("should include the selected theme ids in the apply payload when an active catalog is available.", async() => {
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({
      ...UNRESTRICTED_SETTINGS_FIELDS,
      isAdultContentEnabled: false,
      themeIds: ["theme-a"],
    });
    await openFiltersModal();
    getWrapperVm(getFooter()).$emit("primaryButtonClick");

    expect(wrapper.emitted("applyFilters")).toStrictEqual([
      [
        {
          isAdultContentEnabled: false,
          cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
          categories: [...QUESTION_CATEGORIES],
          themeIds: ["theme-a"],
        },
      ],
    ]);
  });

  it("should reset the theme ids to every active theme when the catalog is available and the header emits reset.", async() => {
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({
      ...UNRESTRICTED_SETTINGS_FIELDS,
      isAdultContentEnabled: true,
      cognitiveDifficulties: ["easy"],
      categories: ["trivia"],
      themeIds: ["theme-a"],
    });
    await openFiltersModal();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(getContent().props("filtersDraft")).toStrictEqual({
      isAdultContentEnabled: false,
      cognitiveDifficulties: [...QUESTION_COGNITIVE_DIFFICULTIES],
      categories: [...QUESTION_CATEGORIES],
      themeIds: ["theme-a", "theme-b"],
    });
  });

  it("should keep the apply button disabled when the catalog loads after the modal is opened without theme changes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should keep the reset hidden when the catalog loads after the modal is opened without user changes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();

    expect(getHeader().props("isResetVisible")).toBe(false);
  });

  it("should enable the apply button when the catalog loads after the modal is opened and the user narrows the themes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();
    getWrapperVm(getContent()).$emit("update:questionThemeIds", ["theme-a"]);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should show the reset button when the catalog loads after opening with a narrowed committed theme selection.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ ...UNRESTRICTED_SETTINGS_FIELDS, isAdultContentEnabled: false, themeIds: ["theme-a"] });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();

    expect(getHeader().props("isResetVisible")).toBe(true);
  });
});