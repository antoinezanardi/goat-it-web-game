import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionContent } from "~~/tests/unit/utils/faketories/question/question-content.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import type { GameQuestionCardSection } from "#components";
import { GameQuestionCard } from "#components";

import type { GameQuestionCardProps } from "@/components/domain/game/GameQuestionCard/game-question-card.types";

describe("GameQuestionCard Component", () => {
  const defaultGameQuestionCardProps: GameQuestionCardProps = {
    isActive: true,
    isFrozen: false,
    question: createFakeQuestion({
      category: "trivia",
      themes: [
        createFakeQuestionThemeAssignment({
          isPrimary: true,
          theme: createFakeQuestionTheme({ color: "#B8860B", label: "Histoire", slug: "history-civilizations" }),
        }),
      ],
      content: createFakeQuestionContent({
        statement: "What is the capital of France?",
        answer: "Paris",
        context: "France is in Europe.",
        trivia: ["Fact 1", "Fact 2"],
      }),
      sourceUrls: ["https://en.wikipedia.org/wiki/France"],
    }),
  } as const;

  let wrapper: VueWrapper;

  async function mountGameQuestionCard(options: MountSuspendedOptions<typeof GameQuestionCard> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCard, { props: defaultGameQuestionCardProps, shallow: false, ...options });
  }

  function getSectionWrapper(dataTestid: string): VueWrapper<InstanceType<typeof GameQuestionCardSection>> {
    const section = wrapper
      .findAllComponents<typeof GameQuestionCardSection>({ name: "GameQuestionCardSection" })
      .find(component => component.props("dataTestid") === dataTestid);

    if (!section) {
      throw new Error(`Expected the "${dataTestid}" game question section to be rendered`);
    }
    return section;
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCard();
  });

  it("should render GameQuestionCard when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the question statement when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-statement']").text()).toBe("What is the capital of France?");
  });

  it("should render the question answer when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-answer']").text()).toBe("Paris");
  });

  it("should have the game-question test id on the article when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question']").exists()).toBe(true);
  });

  it("should set --game-theme-color in the article inline style when theme color is provided.", () => {
    const article = wrapper.find("[data-testid='game-question']");

    expect(article.attributes("style")).toContain("--game-theme-color: #B8860B");
  });

  it("should render the theme header component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardThemeHeader" }).exists()).toBe(true);
  });

  it("should pass the question to the theme header when primary theme exists.", () => {
    const header = wrapper.findComponent({ name: "GameQuestionCardThemeHeader" });

    expect(header.props("question")).toBe(defaultGameQuestionCardProps.question);
  });

  it("should still render the theme header when the question has no primary theme.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ isPrimary: false }), createFakeQuestionThemeAssignment({ isPrimary: false })],
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardThemeHeader" }).exists()).toBe(true);
  });

  it("should render two section components when mounted.", () => {
    expect(wrapper.findAllComponents({ name: "GameQuestionCardSection" })).toHaveLength(2);
  });

  it("should keep the statement and answer test ids on the section body paragraphs when mounted.", () => {
    const sectionTestIds = wrapper
      .findAll("[data-testid='game-question-statement'], [data-testid='game-question-answer']")
      .map(paragraph => paragraph.attributes("data-testid"));

    expect(sectionTestIds).toStrictEqual(["game-question-statement", "game-question-answer"]);
  });

  it("should pass the question label to the statement section when mounted.", () => {
    expect(getSectionWrapper("game-question-statement").props("label")).toBe("questions.questionLabel");
  });

  it("should pass the question label icon to the statement section when mounted.", () => {
    expect(getSectionWrapper("game-question-statement").props("icon")).toBe("i-lucide-help-circle");
  });

  it("should pass the answer label to the answer section when mounted.", () => {
    expect(getSectionWrapper("game-question-answer").props("label")).toBe("questions.answerLabel");
  });

  it("should pass the lightbulb icon to the answer section when mounted.", () => {
    expect(getSectionWrapper("game-question-answer").props("icon")).toBe("i-lucide-lightbulb");
  });

  it("should render the separator component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardThemeSeparator" }).exists()).toBe(true);
  });

  it("should render the source list component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardSourceList" }).exists()).toBe(true);
  });

  it("should pass the question source urls to the source list component when mounted.", () => {
    const sourceList = wrapper.findComponent({ name: "GameQuestionCardSourceList" });

    expect(sourceList.props("sourceUrls")).toStrictEqual(["https://en.wikipedia.org/wiki/France"]);
  });

  it("should render the scrollable body container when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-body']").exists()).toBe(true);
  });

  it("should render the context accordion when context is present.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(true);
  });

  it("should pass the question context to the context accordion when context is present.", () => {
    const accordion = wrapper.findComponent({ name: "GameQuestionCardContextAccordion" });

    expect(accordion.props("context")).toBe("France is in Europe.");
  });

  it("should pass the question trivia to the context accordion when trivia is present.", () => {
    const accordion = wrapper.findComponent({ name: "GameQuestionCardContextAccordion" });

    expect(accordion.props("trivia")).toStrictEqual(["Fact 1", "Fact 2"]);
  });

  it("should render the context accordion when trivia is present but context is empty.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardProps.question,
        content: createFakeQuestionContent({ context: undefined, trivia: ["Only trivia"] }),
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(true);
  });

  it.each<{ condition: string; context?: string; trivia?: string[] }>([
    { condition: "missing", context: undefined, trivia: undefined },
    { condition: "whitespace and empty", context: "   ", trivia: [] },
    { condition: "blank", context: undefined, trivia: ["", "   "] },
  ])("should not render the context accordion when context and trivia are $condition.", async({ context, trivia }) => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardProps.question,
        content: createFakeQuestionContent({ context, trivia }),
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(false);
  });

  it("should render the context accordion when trivia mixes blank and valid items.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardProps.question,
        content: createFakeQuestionContent({ context: undefined, trivia: ["", "Only fact"] }),
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(true);
  });

  it("should render the staged data-testid when isActive is false.", async() => {
    await wrapper.setProps({ isActive: false });

    expect(wrapper.find("[data-testid='game-question-staged']").exists()).toBe(true);
  });

  it("should add the frozen modifier class when isFrozen is true.", async() => {
    await wrapper.setProps({ isFrozen: true });

    expect(wrapper.find("[data-testid='game-question']").classes()).toContain("game-question-card--frozen");
  });

  it("should not add the frozen modifier class when isFrozen is false.", () => {
    expect(wrapper.find("[data-testid='game-question']").classes()).not.toContain("game-question-card--frozen");
  });

  it("should not remount the context accordion when the question id changes.", async() => {
    const initialUid = getWrapperVm(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" })).$.uid;

    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardProps.question,
        id: "new-id",
        content: createFakeQuestionContent({
          context: "Updated context.",
          trivia: ["Updated trivia"],
        }),
      }),
    });

    const updatedUid = getWrapperVm(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" })).$.uid;

    expect(updatedUid).toBe(initialUid);
  });

  it("should pass isActive true to the theme header when mounted.", () => {
    const header = wrapper.findComponent({ name: "GameQuestionCardThemeHeader" });

    expect(header.props("isActive")).toBe(true);
  });

  it("should pass isActive false to the theme header when isActive is false.", async() => {
    await wrapper.setProps({ isActive: false });

    const header = wrapper.findComponent({ name: "GameQuestionCardThemeHeader" });

    expect(header.props("isActive")).toBe(false);
  });
});