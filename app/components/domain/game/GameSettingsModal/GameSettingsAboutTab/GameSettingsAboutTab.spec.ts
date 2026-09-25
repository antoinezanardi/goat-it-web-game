import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameSettingsAboutTab } from "#components";

describe("GameSettingsAboutTab Component", () => {
  let wrapper: VueWrapper;

  async function mountGameSettingsAboutTab(options: MountSuspendedOptions<typeof GameSettingsAboutTab> = {}): Promise<VueWrapper> {
    return mountSuspended(GameSettingsAboutTab, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameSettingsAboutTab();
  });

  it("should render GameSettingsAboutTab when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the about tab root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-about-tab']").exists()).toBe(true);
  });

  it("should render the logo with the brand translation key as its alternative text when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-about-logo']").attributes("alt")).toBe("home.brand");
  });

  it("should render the brand with the brand translation key when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-about-brand']").text()).toBe("home.brand");
  });

  it("should render the tagline with the tagline translation key when mounted.", () => {
    expect(wrapper.find("[data-testid='game-settings-about-tagline']").text()).toBe("home.tagline");
  });

  it("should render the VersionButton component when mounted.", () => {
    expect(wrapper.findComponent({ name: "VersionButton" }).exists()).toBe(true);
  });
});