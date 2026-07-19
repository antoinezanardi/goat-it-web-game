import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionContent } from "~~/tests/unit/utils/faketories/question/question-content.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { GameQuestionCard } from "#components";

describe("GameQuestionCard Component", () => {
  const defaultProps = {
    question: createFakeQuestion({
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
  };

  let wrapper: VueWrapper;

  async function mountCard(options: MountSuspendedOptions<typeof GameQuestionCard> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCard, { props: defaultProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountCard();
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

  it("should not render the theme header when no primary theme is found.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ isPrimary: false })],
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardThemeHeader" }).exists()).toBe(false);
  });

  it("should render the statement component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardStatement" }).exists()).toBe(true);
  });

  it("should render the answer component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardAnswer" }).exists()).toBe(true);
  });

  it("should render the separator component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardThemeSeparator" }).exists()).toBe(true);
  });

  it("should render the source list component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardSourceList" }).exists()).toBe(true);
  });

  it("should render the context accordion when context is present.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(true);
  });

  it("should render the context accordion when trivia is present but context is empty.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultProps.question,
        content: createFakeQuestionContent({ context: undefined, trivia: ["Only trivia"] }),
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(true);
  });

  it("should not render the context accordion when both context and trivia are empty.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultProps.question,
        content: createFakeQuestionContent({ context: undefined, trivia: undefined }),
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardContextAccordion" }).exists()).toBe(false);
  });

  it("should apply the game-theme-scope class when mounted.", () => {
    const article = wrapper.find("[data-testid='game-question']");

    expect(article.classes()).toContain("game-theme-scope");
  });

  it("should apply the game-card-halo class when mounted.", () => {
    const article = wrapper.find("[data-testid='game-question']");

    expect(article.classes()).toContain("game-card-halo");
  });
});