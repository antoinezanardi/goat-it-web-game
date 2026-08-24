import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ExampleRound } from "#components";

import { EXAMPLE_ROUND_BUTTON_UI, EXAMPLE_ROUND_COLLAPSIBLE_UI } from "@/components/content/example-round.constants";

describe("ExampleRound Component", () => {
  let wrapper: VueWrapper;

  async function mountExampleRound(options: MountSuspendedOptions<typeof ExampleRound> = {}): Promise<VueWrapper> {
    return mountSuspended(ExampleRound, {
      slots: {
        default: "**Card:** Category: Animals · Difficulty: Easy",
        trigger: "Complete example round",
      },
      ...options,
    });
  }

  async function mountAndOpenExampleRound(options: MountSuspendedOptions<typeof ExampleRound> = {}): Promise<VueWrapper> {
    const openedWrapper = await mountExampleRound(options);
    await openedWrapper.find("[data-testid='example-round-trigger']").trigger("click");

    return openedWrapper;
  }

  beforeEach(async() => {
    wrapper = await mountExampleRound();
  });

  it("should render ExampleRound when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render UCollapsible when mounted.", () => {
    expect(wrapper.findComponent({ name: "UCollapsible" }).exists()).toBe(true);
  });

  it("should pass the ui config to UCollapsible when mounted.", () => {
    const collapsible = wrapper.findComponent({ name: "UCollapsible" });

    expect(collapsible.props("ui")).toStrictEqual(EXAMPLE_ROUND_COLLAPSIBLE_UI);
  });

  it("should render the collapsible trigger with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='example-round-trigger']").exists()).toBe(true);
  });

  it("should render the trigger label from the trigger slot when mounted.", () => {
    expect(wrapper.text()).toContain("Complete example round");
  });

  it("should render the trigger trailing icon when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("trailingIcon")).toBe("i-lucide-chevron-down");
  });

  it("should pass the ui config to the trigger button when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("ui")).toStrictEqual(EXAMPLE_ROUND_BUTTON_UI);
  });

  it("should not render the card content when the collapsible is collapsed.", () => {
    expect(wrapper.text()).not.toContain("**Card:** Category: Animals · Difficulty: Easy");
  });

  it("should render UCard when the collapsible is open.", async() => {
    wrapper = await mountAndOpenExampleRound();

    expect(wrapper.findComponent({ name: "UCard" }).exists()).toBe(true);
  });

  it("should render the card content from the default slot when the collapsible is open.", async() => {
    wrapper = await mountAndOpenExampleRound();

    expect(wrapper.text()).toContain("**Card:** Category: Animals · Difficulty: Easy");
  });
});