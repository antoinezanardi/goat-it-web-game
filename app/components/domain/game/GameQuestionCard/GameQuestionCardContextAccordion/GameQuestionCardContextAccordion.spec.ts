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

  it("should render a trivia list when trivia is provided.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one"] } });

    expect(wrapper.find("ul").exists()).toBe(true);
  });

  it("should render the correct number of trivia items when trivia is provided.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "Fact two"] } });

    expect(wrapper.findAll("li")).toHaveLength(2);
  });

  it("should render both context and trivia when both are provided.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { context: "Context text.", trivia: ["Trivia item"] } });

    expect(wrapper.text()).toContain("Context text.");
  });

  it("should render trivia items when combined with context.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { context: "Context text.", trivia: ["Trivia item"] } });

    expect(wrapper.text()).toContain("Trivia item");
  });

  it("should not render a context paragraph when context is empty.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { trivia: ["Only trivia"] } });

    expect(wrapper.find(".bg-surface-secondary p.text-sm").exists()).toBe(false);
  });

  it("should not render a trivia list when trivia is empty.", async() => {
    const wrapper = await mountAndOpenAccordion({ props: { context: "Only context" } });

    expect(wrapper.find("ul").exists()).toBe(false);
  });
});