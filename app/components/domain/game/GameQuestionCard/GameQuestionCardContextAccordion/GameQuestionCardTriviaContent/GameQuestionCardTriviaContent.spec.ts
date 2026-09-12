import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardTriviaContent } from "#components";

import type { GameQuestionCardTriviaContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContextAccordion/GameQuestionCardTriviaContent/game-question-card-trivia-content.types";

describe("GameQuestionCardTriviaContent Component", () => {
  const defaultGameQuestionCardTriviaContentProps: GameQuestionCardTriviaContentProps = {
    trivia: ["Fact one", "Fact two"],
  } as const;

  let wrapper: VueWrapper;

  async function mountGameQuestionCardTriviaContent(options: MountSuspendedOptions<typeof GameQuestionCardTriviaContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardTriviaContent, {
      props: defaultGameQuestionCardTriviaContentProps,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCardTriviaContent();
  });

  it("should render GameQuestionCardTriviaContent when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the content with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-trivia-content']").exists()).toBe(true);
  });

  it("should render the title with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-trivia-title']").exists()).toBe(true);
  });

  it("should render the trivia list with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-trivia']").exists()).toBe(true);
  });

  it("should render the title with the i18n key when mounted.", () => {
    expect(wrapper.text()).toContain("questions.triviaTitle");
  });

  it("should render the sparkles icon when mounted.", () => {
    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe("i-lucide-sparkles");
  });

  it.each<{ trivia: string[]; count: number }>([
    { trivia: ["Fact one", "Fact two"], count: 2 },
    { trivia: ["Only fact"], count: 1 },
  ])("should render $count list items when trivia has $count elements.", async({ trivia, count }) => {
    wrapper = await mountGameQuestionCardTriviaContent({ props: { trivia } });

    expect(wrapper.findAll("li")).toHaveLength(count);
  });

  it("should render the trivia item text when trivia is provided.", () => {
    expect(wrapper.text()).toContain("Fact one");
  });
});