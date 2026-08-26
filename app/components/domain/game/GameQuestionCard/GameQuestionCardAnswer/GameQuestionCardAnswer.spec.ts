import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardAnswer } from "#components";

import type { GameQuestionCardAnswerProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardAnswer/game-question-card-answer.types";

describe("GameQuestionCardAnswer Component", () => {
  const defaultGameQuestionCardAnswerProps: GameQuestionCardAnswerProps = {
    text: "Paris",
  } as const;

  let wrapper: VueWrapper;

  async function mountGameQuestionCardAnswer(options: MountSuspendedOptions<typeof GameQuestionCardAnswer> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardAnswer, {
      props: defaultGameQuestionCardAnswerProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCardAnswer();
  });

  it("should render GameQuestionCardAnswer when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the answer label when mounted.", () => {
    expect(wrapper.text()).toContain("questions.answerLabel");
  });

  it("should render the body text when mounted.", () => {
    expect(wrapper.text()).toContain("Paris");
  });

  it("should apply the data-testid attribute to the body paragraph when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-answer']").exists()).toBe(true);
  });

  it("should render the lightbulb icon when mounted.", () => {
    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe("i-lucide-lightbulb");
  });
});