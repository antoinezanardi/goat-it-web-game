import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameSettingsAboutTab, GameSettingsGeneralTab, GameSettingsModal } from "#components";
import type { DefaultModalTitle, UModal } from "#components";

import type { GameSettingsModalProps } from "@/components/domain/game/GameSettingsModal/game-settings-modal.types";

type GameSettingsModalVm = ComponentVm & { activeTab: string | number };

describe("GameSettingsModal Component", () => {
  let wrapper: VueWrapper;

  const defaultGameSettingsModalProps: GameSettingsModalProps = {
    isFetchingQuestions: false,
    open: true,
  } as const;

  async function mountGameSettingsModal(options: MountSuspendedOptions<typeof GameSettingsModal> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsModal, { props: defaultGameSettingsModalProps, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsModal();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("should render GameSettingsModal when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the modal root with the correct data-testid when mounted.", () => {
    expect(document.body.querySelector("[data-testid='game-settings-modal']")).not.toBeNull();
  });

  it("should render a UTabs component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UTabs" }).exists()).toBe(true);
  });

  it("should pass the open prop to UModal when mounted.", () => {
    const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

    expect(modal.props("open")).toBe(true);
  });

  it("should pass open as false to UModal when the open prop is false.", async() => {
    await wrapper.setProps({ open: false });
    const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });

    expect(modal.props("open")).toBe(false);
  });

  it("should render the modal title with the title translation key when mounted.", () => {
    const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='game-settings-modal-title']");

    expect(title.props("title")).toBe("game.settings.title");
  });

  it("should render the settings icon on the modal title when mounted.", () => {
    const title = wrapper.findComponent<typeof DefaultModalTitle>("[data-testid='game-settings-modal-title']");

    expect(title.props("icon")).toBe("i-lucide-settings");
  });

  it("should pass the localized tab items to UTabs when mounted.", () => {
    expect(wrapper.findComponent({ name: "UTabs" }).props("items")).toStrictEqual([
      { icon: "i-lucide-settings", label: "game.settings.tabs.general", slot: "general", value: "general" },
      { icon: "i-lucide-info", label: "game.settings.tabs.about", slot: "about", value: "about" },
    ]);
  });

  it("should select the general tab initially when mounted.", () => {
    expect(wrapper.findComponent({ name: "UTabs" }).props("modelValue")).toBe("general");
  });

  it("should render the General tab content when mounted.", () => {
    expect(wrapper.findComponent(GameSettingsGeneralTab).exists()).toBe(true);
  });

  it("should render the About tab content when UTabs emits update:modelValue with about.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "UTabs" })).$emit("update:modelValue", "about");
    await flushPromises();

    expect(wrapper.findComponent(GameSettingsAboutTab).exists()).toBe(true);
  });

  it("should reset the active tab to general when the modal transitions from closed to open.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "UTabs" })).$emit("update:modelValue", "about");
    await nextTick();
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });

    expect(wrapper.findComponent({ name: "UTabs" }).props("modelValue")).toBe("general");
  });

  it("should keep the active tab when the modal transitions from open to closed.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "UTabs" })).$emit("update:modelValue", "about");
    await nextTick();
    await wrapper.setProps({ open: false });

    expect(getWrapperVm<GameSettingsModalVm>(wrapper).activeTab).toBe("about");
  });

  it("should pass the fetching state as disabled to the General tab when isFetchingQuestions is true.", async() => {
    await wrapper.setProps({ isFetchingQuestions: true });
    const generalTab = wrapper.findComponent(GameSettingsGeneralTab);

    expect(generalTab.props("disabled")).toBe(true);
  });

  it("should pass the fetching state as disabled as false to the General tab when isFetchingQuestions is false.", () => {
    const generalTab = wrapper.findComponent(GameSettingsGeneralTab);

    expect(generalTab.props("disabled")).toBe(false);
  });

  it("should emit update:open when UModal emits update:open.", () => {
    const modal = wrapper.findComponent<typeof UModal>({ name: "UModal" });
    getWrapperVm(modal).$emit("update:open", false);

    expect(wrapper.emitted("update:open")).toStrictEqual([[false]]);
  });
});