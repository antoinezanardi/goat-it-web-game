import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameNextButton } from "#components";

describe("GameNextButton Component", () => {
  let wrapper: VueWrapper;

  async function mountButton(options: MountSuspendedOptions<typeof GameNextButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GameNextButton, { shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountButton();
  });

  it("should render the next question label translation key when mounted.", () => {
    expect(wrapper.text()).toContain("game.nextQuestion");
  });

  it("should emit click when the button is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeDefined();
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(wrapper.find("[data-testid='game-next-button']").exists()).toBe(true);
  });

  it("should apply the themed class when not disabled and not loading.", () => {
    expect(wrapper.find("button").classes()).toContain("game-next-button--themed");
  });

  it("should not apply the themed class when disabled.", async() => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find("button").classes()).not.toContain("game-next-button--themed");
  });

  it("should not apply the themed class when loading.", async() => {
    await wrapper.setProps({ loading: true });

    expect(wrapper.find("button").classes()).not.toContain("game-next-button--themed");
  });

  it("should forward the disabled prop to the underlying button element when disabled is true.", async() => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });
});