import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { HomePlayButton } from "#components";

import { HOME_PLAY_BUTTON_UI } from "@/components/domain/home/HomePlayButton/home-play-button.constants";

describe("HomePlayButton Component", () => {
  let wrapper: VueWrapper;

  async function mountHomePlayButton(options: MountSuspendedOptions<typeof HomePlayButton> = {}): Promise<VueWrapper> {
    return mountSuspended(HomePlayButton, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountHomePlayButton();
  });

  it("should render the gradient wrapper with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='home-play-button']").exists()).toBe(true);
  });

  it("should render a UButton with the play label translation key when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("label")).toBe("home.playButton");
  });

  it("should render a UButton linking to /game when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("to")).toBe("/game");
  });

  it("should render a UButton with the HOME_PLAY_BUTTON_UI ui config when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(HOME_PLAY_BUTTON_UI);
  });
});