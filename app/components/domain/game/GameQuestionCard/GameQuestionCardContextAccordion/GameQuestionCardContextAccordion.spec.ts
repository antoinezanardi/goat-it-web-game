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

  it("should render UCollapsible when mounted.", () => {
    expect(wrapper.findComponent({ name: "UCollapsible" }).exists()).toBe(true);
  });

  it("should render the accordion trigger with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-context-accordion-trigger']").exists()).toBe(true);
  });

  it("should render the context paragraph with its testid when the accordion is open and context is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Some historical context." } });

    expect(wrapper.find("[data-testid='game-question-context']").exists()).toBe(true);
  });

  it("should render the trivia content when the accordion is open and trivia is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "Fact two"] } });

    expect(wrapper.findComponent({ name: "GameQuestionCardTriviaContent" }).exists()).toBe(true);
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

  it("should render the trimmed context when context has surrounding whitespace.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { context: "   Padded context.   " } });

    expect(wrapper.find("[data-testid='game-question-context']").text()).toBe("Padded context.");
  });

  it("should render a trivia list with the correct number of items when trivia is provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "Fact two"] } });

    expect(wrapper.findAll("li")).toHaveLength(2);
  });

  it("should render only a single trivia item when trivia has one element.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one"] } });

    expect(wrapper.findAll("li")).toHaveLength(1);
  });

  it("should pass only non-blank trivia items to the trivia content when trivia mixes blank and valid items.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Fact one", "", "   "] } });

    expect(wrapper.findComponent({ name: "GameQuestionCardTriviaContent" }).props("trivia")).toStrictEqual(["Fact one"]);
  });

  it("should apply top spacing to the trivia content when both context and trivia are provided.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Context text.", trivia: ["Trivia item"] } });

    expect(wrapper.findComponent({ name: "GameQuestionCardTriviaContent" }).classes()).toContain("mt-3");
  });

  it("should not apply top spacing to the trivia content when context is missing.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Trivia item"] } });

    expect(wrapper.findComponent({ name: "GameQuestionCardTriviaContent" }).classes()).not.toContain("mt-3");
  });

  it.each<{ text: string }>([
    { text: "Context text." },
    { text: "Trivia item" },
  ])("should render '$text' when both context and trivia are provided.", async({ text }) => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Context text.", trivia: ["Trivia item"] } });

    expect(wrapper.text()).toContain(text);
  });

  it.each<{ condition: string; props: GameQuestionCardContextAccordionProps }>([
    { condition: "missing", props: { trivia: ["Only trivia"] } },
    { condition: "blank", props: { context: "   ", trivia: ["Only trivia"] } },
  ])("should not render a context paragraph when context is $condition.", async({ props }) => {
    wrapper = await mountAndOpenAccordion({ props });

    expect(wrapper.find("[data-testid='game-question-context']").exists()).toBe(false);
  });

  it.each<{ condition: string; props: GameQuestionCardContextAccordionProps }>([
    { condition: "missing", props: { context: "Only context" } },
    { condition: "blank", props: { context: "Only context", trivia: ["", "   "] } },
  ])("should not render trivia content when trivia is $condition.", async({ props }) => {
    wrapper = await mountAndOpenAccordion({ props });

    expect(wrapper.find("[data-testid='game-question-trivia-content']").exists()).toBe(false);
  });

  it("should close the accordion when the context prop changes.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { context: "Initial context." } });

    await wrapper.setProps({ context: "Updated context." });

    expect(wrapper.findComponent({ name: "UCollapsible" }).props("open")).toBe(false);
  });

  it("should close the accordion when the trivia prop changes.", async() => {
    wrapper = await mountAndOpenAccordion({ props: { trivia: ["Initial trivia"] } });

    await wrapper.setProps({ trivia: ["Updated trivia"] });

    expect(wrapper.findComponent({ name: "UCollapsible" }).props("open")).toBe(false);
  });

  it("should open the accordion when the trigger is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.findComponent({ name: "UCollapsible" }).props("open")).toBe(true);
  });
});