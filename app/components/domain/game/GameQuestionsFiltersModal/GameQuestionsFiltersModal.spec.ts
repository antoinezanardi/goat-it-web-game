import { createTestingPinia } from "@pinia/testing";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";
import { createFakeGameSettings } from "~~/tests/unit/utils/faketories/game-settings/game-settings.entity.faketory";

import {
  GameQuestionsFiltersModal,
} from "#components";
import type {
  DefaultModalFooter,
  DefaultModalTitle,
  UModal,
  GameSettingsAdultContentSwitch,
  GameSettingsCognitiveDifficultiesFilter,
} from "#components";

import { GAME_QUESTIONS_FILTERS_MODAL_UI } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.constants";
import type { GameQuestionsFiltersModalProps } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.types";
import { useGameSettingsStore } from "@/stores/domain/game-settings/game-settings.store";

describe("GameQuestionsFiltersModal Component", () => {
  let wrapper: VueWrapper;

  const defaultGameQuestionsFiltersModalProps: GameQuestionsFiltersModalProps = {
    isApplyPending: false,
    isOpen: false,
  } as const;

  async function mountGameQuestionsFiltersModal(options: MountSuspendedOptions<typeof GameQuestionsFiltersModal> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionsFiltersModal, { props: defaultGameQuestionsFiltersModalProps, global: { plugins: [createTestingPinia()] }, ...options });
  }

  function getFooter(): VueWrapper<InstanceType<typeof DefaultModalFooter>> {
    return wrapper.findComponent<typeof DefaultModalFooter>({ name: "DefaultModalFooter" });
  }

  function getAdultContentSwitch(): VueWrapper<InstanceType<typeof GameSettingsAdultContentSwitch>> {
    return wrapper.findComponent<typeof GameSettingsAdultContentSwitch>({ name: "GameSettingsAdultContentSwitch" });
  }

  function getCognitiveDifficultiesFilter(): VueWrapper<InstanceType<typeof GameSettingsCognitiveDifficultiesFilter>> {
    return wrapper.findComponent<typeof GameSettingsCognitiveDifficultiesFilter>({ name: "GameSettingsCognitiveDifficultiesFilter" });
  }

  async function openFiltersModal(): Promise<void> {
    await wrapper.setProps({ isOpen: true });
    await nextTick();
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

  it("should render the modal title with the title translation key when opened.", async() => {
    await openFiltersModal();
    const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='game-questions-filters-modal-title']");

    expect(title.props("title")).toBe("game.questionsFilters.title");
  });

  it("should render the funnel icon on the modal title when opened.", async() => {
    await openFiltersModal();
    const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='game-questions-filters-modal-title']");

    expect(title.props("icon")).toBe("i-lucide-funnel");
  });

  it("should render the modal footer with the correct data-testid when opened.", async() => {
    await openFiltersModal();

    expect(wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='game-questions-filters-modal-footer']").exists()).toBe(true);
  });

  it("should render the separator between the filters when opened.", async() => {
    await openFiltersModal();

    expect(wrapper.findComponent({ name: "USeparator" }).exists()).toBe(true);
  });

  it("should render the adult content switch component when opened.", async() => {
    await openFiltersModal();

    expect(getAdultContentSwitch().exists()).toBe(true);
  });

  it("should render the cognitive difficulties filter component when opened.", async() => {
    await openFiltersModal();

    expect(getCognitiveDifficultiesFilter().exists()).toBe(true);
  });

  it("should snapshot the committed adult content value into the switch when opened.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: true });
    await openFiltersModal();

    expect(getAdultContentSwitch().props("isAdultContentEnabled")).toBe(true);
  });

  it("should snapshot the committed cognitive difficulties into the filter when opened.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ cognitiveDifficulties: ["easy"] });
    await openFiltersModal();

    expect(getCognitiveDifficultiesFilter().props("modelValue")).toStrictEqual(["easy"]);
  });

  it("should pass the apply translation key as the footer primary button label when opened.", async() => {
    await openFiltersModal();

    expect(getFooter().props("primaryButtonLabel")).toBe("game.questionsFilters.apply");
  });

  it("should pass the check icon to the footer primary button when opened.", async() => {
    await openFiltersModal();

    expect(getFooter().props("primaryButtonIcon")).toBe("i-lucide-check");
  });

  it("should pass the apply pending state as loading to the footer when it is pending.", async() => {
    await openFiltersModal();
    await wrapper.setProps({ isApplyPending: true });

    expect(getFooter().props("isPrimaryButtonLoading")).toBe(true);
  });

  it("should disable the apply action when the draft matches the committed values.", async() => {
    await openFiltersModal();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should enable the apply action when the adult content draft changes.", async() => {
    await openFiltersModal();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should enable the apply action when the cognitive difficulties draft changes.", async() => {
    await openFiltersModal();
    getWrapperVm(getCognitiveDifficultiesFilter()).$emit("update:modelValue", ["easy"]);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should keep the apply action disabled when the difficulties are reordered with the same values.", async() => {
    await openFiltersModal();
    getWrapperVm(getCognitiveDifficultiesFilter()).$emit("update:modelValue", ["hard", "easy", "medium"]);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should disable the apply action when the draft is reverted to the committed values.", async() => {
    await openFiltersModal();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await nextTick();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", false);
    await nextTick();

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should disable the apply action while a previous apply is pending even when the draft changed.", async() => {
    await openFiltersModal();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await wrapper.setProps({ isApplyPending: true });

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(true);
  });

  it("should enable the apply action when the pending state clears while the draft still differs.", async() => {
    await openFiltersModal();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await wrapper.setProps({ isApplyPending: true });
    await wrapper.setProps({ isApplyPending: false });

    expect(getFooter().props("isPrimaryButtonDisabled")).toBe(false);
  });

  it("should emit apply with the current draft when the footer primary button is clicked.", async() => {
    mockStore(useGameSettingsStore).settings = createFakeGameSettings({ isAdultContentEnabled: false, cognitiveDifficulties: ["easy", "medium", "hard"] });
    await openFiltersModal();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await nextTick();
    getWrapperVm(getFooter()).$emit("primaryButtonClick");

    expect(wrapper.emitted("apply")).toStrictEqual([[{ isAdultContentEnabled: true, cognitiveDifficulties: ["easy", "medium", "hard"] }]]);
  });

  it("should emit update:isOpen when UModal emits update:open.", async() => {
    await openFiltersModal();
    getWrapperVm(wrapper.findComponent<typeof UModal>({ name: "UModal" })).$emit("update:open", false);

    expect(wrapper.emitted("update:isOpen")).toStrictEqual([[false]]);
  });

  it("should emit update:isOpen as false when the footer emits closeModal.", async() => {
    await openFiltersModal();
    getWrapperVm(getFooter()).$emit("closeModal");

    expect(wrapper.emitted("update:isOpen")).toStrictEqual([[false]]);
  });

  it("should reset the draft to the latest committed values when reopened.", async() => {
    const store = mockStore(useGameSettingsStore);
    store.settings = createFakeGameSettings({ isAdultContentEnabled: false });
    await openFiltersModal();
    getWrapperVm(getAdultContentSwitch()).$emit("update:isAdultContentEnabled", true);
    await nextTick();
    await wrapper.setProps({ isOpen: false });
    store.settings = createFakeGameSettings({ isAdultContentEnabled: false });
    await openFiltersModal();

    expect(getAdultContentSwitch().props("isAdultContentEnabled")).toBe(false);
  });
});