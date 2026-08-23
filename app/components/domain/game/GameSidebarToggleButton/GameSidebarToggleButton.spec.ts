import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameSidebarToggleButton } from "#components";

import { GAME_SIDEBAR_TOGGLE_BUTTON_UI } from "@/components/domain/game/GameSidebarToggleButton/game-sidebar-toggle-button.constants";

describe("GameSidebarToggleButton Component", () => {
  let wrapper: VueWrapper;

  async function mountGameSidebarToggleButton(options: MountSuspendedOptions<typeof GameSidebarToggleButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSidebarToggleButton, { shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSidebarToggleButton();
  });

  it("should render GameSidebarToggleButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render a UButton when mounted.", () => {
    expect(wrapper.findComponent({ name: "UButton" }).exists()).toBeTruthy();
  });

  it("should set the UButton icon to the menu icon when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("icon")).toBe("i-lucide-menu");
  });

  it("should pass the GAME_SIDEBAR_TOGGLE_BUTTON_UI ui config to UButton when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(GAME_SIDEBAR_TOGGLE_BUTTON_UI);
  });

  it("should emit click when the button is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeDefined();
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(wrapper.find("[data-testid='game-sidebar-toggle-button']").exists()).toBe(true);
  });

  it("should set the aria-label attribute to the i18n tooltip key when mounted.", () => {
    expect(wrapper.find("button").attributes("aria-label")).toBe("game.menuTooltip");
  });

  it("should render the tooltip with the i18n text key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.props("text")).toBe("game.menuTooltip");
  });
});