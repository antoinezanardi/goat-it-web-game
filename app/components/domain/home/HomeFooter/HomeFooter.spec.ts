import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { UButton } from "#components";
import { HomeFooter } from "#components";

import { HOME_HOW_TO_PLAY_BUTTON_UI } from "@/components/domain/home/HomeFooter/home-footer.constants";

describe("HomeFooter Component", () => {
  let wrapper: VueWrapper;

  async function mountHomeFooter(options: MountSuspendedOptions<typeof HomeFooter> = {}): Promise<VueWrapper> {
    return mountSuspended(HomeFooter, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountHomeFooter();
  });

  it("should render the footer root with the correct data-testid when mounted.", () => {
    expect(wrapper.find("[data-testid='home-footer']").exists()).toBe(true);
  });

  it("should render a How to Play UButton with the howToPlay label translation key when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>({ name: "UButton" });

    expect(button.props("label")).toBe("home.howToPlay");
  });

  it("should render a How to Play UButton linking to /rules when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>({ name: "UButton" });

    expect(button.props("to")).toBe("/rules");
  });

  it("should render a How to Play UButton with the help-circle icon when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>({ name: "UButton" });

    expect(button.props("icon")).toBe("i-lucide-help-circle");
  });

  it("should render a How to Play UButton with the HOME_HOW_TO_PLAY_BUTTON_UI ui config when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(HOME_HOW_TO_PLAY_BUTTON_UI);
  });

  it("should render the VersionButton component when mounted.", () => {
    expect(wrapper.findComponent({ name: "VersionButton" }).exists()).toBe(true);
  });
});