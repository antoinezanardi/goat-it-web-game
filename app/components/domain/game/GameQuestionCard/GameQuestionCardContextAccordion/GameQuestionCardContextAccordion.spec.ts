import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardContextAccordion } from "#components";

import type { GameQuestionCardContextAccordionProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/game-question-card-context-accordion.types";

describe("GameQuestionCardContextAccordion Component", () => {
  const defaultGameQuestionCardContextAccordionProps: GameQuestionCardContextAccordionProps = {} as const;
  let wrapper: VueWrapper;

  async function mountGameQuestionCardContextAccordion(options: MountSuspendedOptions<typeof GameQuestionCardContextAccordion> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardContextAccordion, {
      props: defaultGameQuestionCardContextAccordionProps,
      ...options,
    });
  }

  async function mountAndOpenAccordion(options: MountSuspendedOptions<typeof GameQuestionCardContextAccordion> = {}): Promise<VueWrapper> {
    const openedWrapper = await mountGameQuestionCardContextAccordion(options);
    await openedWrapper.find("button").trigger("click");

    return openedWrapper;
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCardContextAccordion();
  });

  it("should render GameQuestionCardContextAccordion when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the accordion trigger with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-context-accordion-trigger']").exists()).toBe(true);
  });

  it("should render the context paragraph with its testid when the accordion is open and context is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Some historical context." } });

    expect(wrapper.find("[data-testid='game-question-context']").exists()).toBe(true);
  });

  it("should render the trivia list with its testid when the accordion is open and trivia is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "Fact two"] } });

    expect(wrapper.find("[data-testid='game-question-trivia']").exists()).toBe(true);
  });

  it("should render the accordion trigger with the i18n title when mounted.", () => {
    expect(wrapper.text()).toContain("questions.contextAccordionTitle");
  });

  it("should render the accordion trigger leading icon when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("leadingIcon")).toBe("i-lucide-file-text");
  });

  it("should render the accordion trigger trailing icon when mounted.", () => {
    const trigger = wrapper.findComponent({ name: "UButton" });

    expect(trigger.props("trailingIcon")).toBe("i-lucide-chevron-down");
  });

  it("should render the context paragraph when context is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Some historical context." } });

    expect(wrapper.text()).toContain("Some historical context.");
  });

  it("should render a trivia list with the correct number of items when trivia is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "Fact two"] } });

    expect(wrapper.findAll("li")).toHaveLength(2);
  });

  it("should render only a single trivia item when trivia has one element.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one"] } });

    expect(wrapper.findAll("li")).toHaveLength(1);
  });

  it.each<{ text: string }>([
    { text: "Context text." },
    { text: "Trivia item" },
  ])("should render '$text' when both context and trivia are provided.", async({ text }) => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Context text.", trivia: ["Trivia item"] } });

    expect(wrapper.text()).toContain(text);
  });

  it.each<{ description: string; props: GameQuestionCardContextAccordionProps; selector: string }>([
    { description: "a context paragraph", props: { trivia: ["Only trivia"] }, selector: ".bg-content p.text-sm" as const },
    { description: "a trivia list", props: { context: "Only context" }, selector: "ul" as const },
  ])("should not render $description when the corresponding prop is empty.", async({ props, selector }) => {
    wrapper = await mountAndOpenAccordion({ props });

    expect(wrapper.find(selector).exists()).toBe(false);
  });
});