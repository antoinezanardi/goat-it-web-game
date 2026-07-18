import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardContextAccordion } from "#components";

describe("GameQuestionCardContextAccordion Component", () => {
  async function mountAccordion(options: MountSuspendedOptions<typeof GameQuestionCardContextAccordion> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardContextAccordion, {
      shallow: false,
      ...options,
    });
  }

  async function mountAndOpenAccordion(options: MountSuspendedOptions<typeof GameQuestionCardContextAccordion> = {}): Promise<VueWrapper> {
    const wrapper = await mountAccordion(options);
    await wrapper.find("button").trigger("click");

    return wrapper;
  }

  it("should render the accordion trigger with the i18n title when mounted.", async() => {
    const wrapper = await mountAccordion();

    expect(wrapper.text()).toContain("questions.contextAccordionTitle");
  });

  it("should render the context paragraph when context is provided.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { context: "Some historical context." } });

    expect(wrapper.text()).toContain("Some historical context.");
  });

  it("should render a trivia list with the correct number of items when trivia is provided.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "Fact two"] } });

    expect(wrapper.findAll("li")).toHaveLength(2);
  });

  it("should render only a single trivia item when trivia has one element.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one"] } });

    expect(wrapper.findAll("li")).toHaveLength(1);
  });

  it.each([
    { text: "Context text." },
    { text: "Trivia item" },
  ])("should render '$text' when both context and trivia are provided.", async({ text }) => {
    const wrapper = await mountAndOpenAccordion({ props: { context: "Context text.", trivia: ["Trivia item"] } });

    expect(wrapper.text()).toContain(text);
  });

  it.each([
    { description: "a context paragraph", props: { trivia: ["Only trivia"] }, selector: ".bg-surface-secondary p.text-sm" as const },
    { description: "a trivia list", props: { context: "Only context" }, selector: "ul" as const },
  ])("should not render $description when the corresponding prop is empty.", async({ props, selector }) => {
    const wrapper = await mountAndOpenAccordion({ props });

    expect(wrapper.find(selector).exists()).toBe(false);
  });
});