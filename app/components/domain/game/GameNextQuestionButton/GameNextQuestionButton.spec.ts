import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameNextQuestionButton } from "#components";

import type { GameNextQuestionButtonProps } from "@/components/domain/game/GameNextQuestionButton/game-next-question-button.types";

describe("GameNextQuestionButton Component", () => {
  let wrapper: VueWrapper;

  const defaultGameNextQuestionButtonProps: GameNextQuestionButtonProps = {} as const;

  async function mountButton(options: MountSuspendedOptions<typeof GameNextQuestionButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GameNextQuestionButton, { props: defaultGameNextQuestionButtonProps, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountButton();
  });

  it("should render GameNextQuestionButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should set the trailing icon on the UButton when mounted.", () => {
    expect(wrapper.findComponent({ name: "UButton" }).props("trailingIcon")).toBe("i-lucide-arrow-right");
  });

  it("should render the next question label translation key when mounted.", () => {
    expect(wrapper.findComponent({ name: "UButton" }).props("label")).toBe("game.nextQuestion");
  });

  it("should emit click when the button is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeDefined();
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(wrapper.find("[data-testid='game-next-question-button']").exists()).toBe(true);
  });

  it("should forward the disabled prop to the underlying button element when disabled is true.", async() => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });

  it("should forward the loading prop to the underlying button when loading is true.", async() => {
    await wrapper.setProps({ loading: true });

    expect(wrapper.findComponent({ name: "UButton" }).props("loading")).toBeTruthy();
  });
});