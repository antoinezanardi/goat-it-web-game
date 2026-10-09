import { QUESTION_CATEGORIES } from "@goat-it/schemas/question";
import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";
import { useQuestionThemesStore } from "@/stores/domain/question-theme/question-themes.store";

describe("GameQuestionsFiltersModal Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersModalProps: GameQuestionsFiltersModalProps = {
    isApplyPending: false,
    isOpen: false,
  } as const;

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
    await wrapper.setProps({ isOpen: true });
    await nextTick();
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

  it("should pass the isOpen prop to UModal when opened.", async() => {
    await openFiltersModal();
    const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

    expect(modal.props("open")).toBe(true);
  });

  it("should pass the GAME_QUESTIONS_FILTERS_MODAL_UI ui config to UModal when mounted.", () => {
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
    await wrapper.setProps({ isApplyPending: true });

    expect(getFooter().props("isPrimaryButtonLoading")).toBe(true);
  });

  it("should pass the applied count to the header when the committed settings have one active group.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();

    expect(getHeader().props("appliedCount")).toBe(1);
  });

  it("should keep the applied count passed to the header unchanged when the draft changes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });
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
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] }));
  });

  it("should update the draft adult content when the content emits update:isAdultContentEnabled.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] }));
  });

  it("should update the draft cognitive difficulties when the content emits update:cognitiveDifficulties.", async() => {
    await openFiltersModal();
    emitCognitiveDifficultiesDraft(["easy"]);
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] }));
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
    await wrapper.setProps({ isApplyPending: true });

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should enable the apply action when the pending state clears while the draft still differs.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await wrapper.setProps({ isApplyPending: true });
    await wrapper.setProps({ isApplyPending: false });

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should emit applyFilters with the current draft when the footer primary button is clicked.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("primaryButtonClick");

    expect(wrapper.emitted("applyFilters")).toStrictEqual([
      [
        {
          isAdultContentEnabled: true,
          cognitiveDifficulties: ["easy", "medium", "hard"],
          categories: [...QUESTION_CATEGORIES],
        },
      ],
    ]);
  });

  it("should reset the adult content draft to disabled when the header emits reset.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] }));
  });

  it("should reset the cognitive difficulties draft to all difficulties when the header emits reset.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy"] });
    await openFiltersModal();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] }));
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
  ])("should emit update:isOpen as $openValue when UModal emits update:open as $openValue.", async({ openValue, expectedEmitted }) => {
    await openFiltersModal();
    getWrapperVm(wrapper.findComponent<typeof UModal>({ name: "UModal" })).$emit("update:open", openValue);

    expect(wrapper.emitted("update:isOpen")).toStrictEqual(expectedEmitted);
  });

  it("should emit update:isOpen as false when the footer emits closeModal.", async() => {
    await openFiltersModal();
    getWrapperVm(getFooter()).$emit("closeModal");

    expect(wrapper.emitted("update:isOpen")).toStrictEqual([[false]]);
  });

  it("should reset the draft to the latest committed values when reopened.", async() => {
    const store = mockStore(useGameSettingsStore);
    store.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    await wrapper.setProps({ isOpen: false });
    store.settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] }));
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

    expect(wrapper.emitted("update:isOpen")).toStrictEqual([[false]]);
  });

  it("should keep the filters modal open and preserve the draft when the discard confirmation is canceled.", async() => {
    await openFiltersModal();
    emitAdultContentDraft(true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("closeModal");
    await flushPromises();
    getCreatedModalInstance().close(false);
    await flushPromises();

    expect(wrapper.emitted("update:isOpen")).toBeUndefined();
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
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy", "medium", "hard"],
      categories: ["trivia", "riddle"],
      themeIds: ["theme-a"],
    });
    await openFiltersModal();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy", "medium", "hard"],
      categories: ["trivia", "riddle"],
      themeIds: ["theme-a"],
    }));
  });

  it("should update the draft categories when the content emits update:categories.", async() => {
    await openFiltersModal();
    getWrapperVm(getContent()).$emit("update:categories", ["trivia"]);
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy", "medium", "hard"],
      categories: ["trivia"],
    }));
  });

  it("should update the draft theme ids when the content emits update:themeIds.", async() => {
    await openFiltersModal();
    getWrapperVm(getContent()).$emit("update:themeIds", ["theme-a"]);
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy", "medium", "hard"],
      themeIds: ["theme-a"],
    }));
  });

  it("should include the selected theme ids in the apply payload when an active catalog is available.", async() => {
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy", "medium", "hard"],
      themeIds: ["theme-a"],
    });
    await openFiltersModal();
    getWrapperVm(getFooter()).$emit("primaryButtonClick");

    expect(wrapper.emitted("applyFilters")).toStrictEqual([
      [
        {
          isAdultContentEnabled: false,
          cognitiveDifficulties: ["easy", "medium", "hard"],
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
      isAdultContentEnabled: true,
      cognitiveDifficulties: ["easy"],
      categories: ["trivia"],
      themeIds: ["theme-a"],
    });
    await openFiltersModal();
    getWrapperVm(getHeader()).$emit("reset");
    await nextTick();

    expect(getContent().props("draft")).toStrictEqual(createFakeGameSettings({
      isAdultContentEnabled: false,
      cognitiveDifficulties: ["easy", "medium", "hard"],
      themeIds: ["theme-a", "theme-b"],
    }));
  });

  it("should keep the apply button disabled when the catalog loads after the modal is opened without theme changes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, themeIds: [] });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should keep the reset hidden when the catalog loads after the modal is opened without user changes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, themeIds: [] });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();

    expect(getHeader().props("isResetVisible")).toBe(false);
  });

  it("should enable the apply button when the catalog loads after the modal is opened and the user narrows the themes.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, themeIds: [] });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();
    getWrapperVm(getContent()).$emit("update:themeIds", ["theme-a"]);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should show the reset button when the catalog loads after opening with a narrowed committed theme selection.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, themeIds: ["theme-a"] });
    await openFiltersModal();
    mockStore(useQuestionThemesStore).questionThemes = [
      createFakeQuestionTheme({ id: "theme-a", status: "active" }),
      createFakeQuestionTheme({ id: "theme-b", status: "active" }),
    ];
    await nextTick();

    expect(getHeader().props("isResetVisible")).toBe(true);
  });
});