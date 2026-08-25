import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { ExampleRound } from "#components";

import { EXAMPLE_ROUND_BUTTON_UI } from "@/components/content/example-round.constants";

const TRIGGER_OPEN_LABEL = "Show a complete example of a round";
const TRIGGER_CLOSE_LABEL = "Hide a complete example of a round";
const DEFAULT_SLOT_CONTENT = "**Card:** Category: Animals · Difficulty: Easy";

describe("ExampleRound Component", () => {
  let wrapper: VueWrapper;

  async function mountExampleRound(options: MountSuspendedOptions<typeof ExampleRound> = {}): Promise<VueWrapper> {
    return mountSuspended(ExampleRound, {
      slots: {
        default: DEFAULT_SLOT_CONTENT,
        triggerOpen: TRIGGER_OPEN_LABEL,
        triggerClose: TRIGGER_CLOSE_LABEL,
      },
      ...options,
    });
  }

  async function mountAndOpenExampleRound(options: MountSuspendedOptions<typeof ExampleRound> = {}): Promise<VueWrapper> {
    const openedWrapper = await mountExampleRound(options);
    await openedWrapper.find("[data-testid='example-round-trigger']").trigger("click");

    return openedWrapper;
  }

  async function mountOpenAndCloseExampleRound(options: MountSuspendedOptions<typeof ExampleRound> = {}): Promise<VueWrapper> {
    const closedAgainWrapper = await mountAndOpenExampleRound(options);
    await closedAgainWrapper.find("[data-testid='example-round-trigger']").trigger("click");

    return closedAgainWrapper;
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

  it("should render the collapsible trigger with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='example-round-trigger']").exists()).toBe(true);
  });

  it("should render the open trigger label from the trigger-open slot when the collapsible is collapsed.", () => {
    expect(wrapper.text()).toContain(TRIGGER_OPEN_LABEL);
  });

  it("should not render the close trigger label from the trigger-close slot when the collapsible is collapsed.", () => {
    expect(wrapper.text()).not.toContain(TRIGGER_CLOSE_LABEL);
  });

  it("should render the close trigger label from the trigger-close slot when the collapsible is open.", async() => {
    wrapper = await mountAndOpenExampleRound();

    expect(wrapper.text()).toContain(TRIGGER_CLOSE_LABEL);
  });

  it("should not render the open trigger label from the trigger-open slot when the collapsible is open.", async() => {
    wrapper = await mountAndOpenExampleRound();

    expect(wrapper.text()).not.toContain(TRIGGER_OPEN_LABEL);
  });

  it("should render the open trigger label again when the collapsible is closed after being opened.", async() => {
    wrapper = await mountOpenAndCloseExampleRound();

    expect(wrapper.text()).toContain(TRIGGER_OPEN_LABEL);
  });

  it("should render the trigger trailing icon when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("trailingIcon")).toBe("i-lucide-chevron-down");
  });

  it("should render the trigger leading icon when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("icon")).toBe("i-lucide-drama");
  });

  it("should pass the secondary color to the trigger button when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("color")).toBe("secondary");
  });

  it("should pass the ui config to the trigger button when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("ui")).toStrictEqual(EXAMPLE_ROUND_BUTTON_UI);
  });

  it("should not render the card content when the collapsible is collapsed.", () => {
    expect(wrapper.text()).not.toContain(DEFAULT_SLOT_CONTENT);
  });

  it("should render the card content from the default slot when the collapsible is open.", async() => {
    wrapper = await mountAndOpenExampleRound();

    expect(wrapper.text()).toContain(DEFAULT_SLOT_CONTENT);
  });
});