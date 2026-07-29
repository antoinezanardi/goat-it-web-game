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

  it("should apply flex class to the article when mounted.", () => {
    const article = wrapper.find("[data-testid='game-question']");

    expect(article.classes()).toContain("flex");
  });

  it("should apply flex-col class to the article when mounted.", () => {
    const article = wrapper.find("[data-testid='game-question']");

    expect(article.classes()).toContain("flex-col");
  });

  it("should render the theme header component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardThemeHeader" }).exists()).toBe(true);
  });

  it("should pass the question category to the theme header when primary theme exists.", () => {
    const header = wrapper.findComponent({ name: "GameQuestionCardThemeHeader" });

    expect(header.props("category")).toBe("trivia");
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

  it("should render the source list component outside the scrollable body when mounted.", () => {
    const bodyDiv = wrapper.find("[data-testid='game-question-body']");
    const sourceListInBody = bodyDiv.findComponent({ name: "GameQuestionCardSourceList" });

    expect(sourceListInBody.exists()).toBe(false);
  });

  it("should apply overflow-y-auto class to the scrollable body div when mounted.", () => {
    const bodyDiv = wrapper.find("[data-testid='game-question-body']");

    expect(bodyDiv.classes()).toContain("overflow-y-auto");
  });

  it("should apply flex-1 class to the scrollable body div when mounted.", () => {
    const bodyDiv = wrapper.find("[data-testid='game-question-body']");

    expect(bodyDiv.classes()).toContain("flex-1");
  });

  it("should apply min-h-0 class to the scrollable body div when mounted.", () => {
    const bodyDiv = wrapper.find("[data-testid='game-question-body']");

    expect(bodyDiv.classes()).toContain("min-h-0");
  });

  it("should apply shrink-0 class to the source list when mounted.", () => {
    const sourceList = wrapper.findComponent({ name: "GameQuestionCardSourceList" });

    expect(sourceList.classes()).toContain("shrink-0");
  });

  it("should apply pt-4 class to the source list when mounted.", () => {
    const sourceList = wrapper.findComponent({ name: "GameQuestionCardSourceList" });

    expect(sourceList.classes()).toContain("pt-4");
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

  it.each([
    { cssClass: "game-theme-scope" },
    { cssClass: "game-card-halo" },
    { cssClass: "h-[calc(100dvh-10rem)]" },
    { cssClass: "md:max-h-[650px]" },
  ])("should apply $cssClass class to the article when mounted.", ({ cssClass }) => {
    const article = wrapper.find("[data-testid='game-question']");

    expect(article.classes()).toContain(cssClass);
  });
});