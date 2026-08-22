import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameSidebarToggleButton } from "#components";

describe("GameSidebarToggleButton Component", () => {
  let wrapper: VueWrapper;

  async function mountGameSidebarToggleButton(options: MountSuspendedOptions<typeof GameSidebarToggleButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSidebarToggleButton, { shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSidebarToggleButton();
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