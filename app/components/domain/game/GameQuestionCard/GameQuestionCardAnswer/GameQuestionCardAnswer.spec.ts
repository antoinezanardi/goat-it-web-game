import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardAnswer } from "#components";

import type { GameQuestionCardAnswerProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardAnswer/game-question-card-answer.types";

describe("GameQuestionCardAnswer Component", () => {
  const defaultProps: GameQuestionCardAnswerProps = {
    text: "Paris",
    textTestId: "test-content",
  };

  let wrapper: VueWrapper;

  async function mountAnswer(options: MountSuspendedOptions<typeof GameQuestionCardAnswer> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardAnswer, {
      props: defaultProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountAnswer();
  });

  it("should render the answer label when mounted.", () => {
    expect(wrapper.text()).toContain("questions.answerLabel");
  });

  it("should render the body text when mounted.", () => {
    expect(wrapper.text()).toContain("Paris");
  });

  it("should apply the data-testid attribute to the body paragraph when provided.", () => {
    expect(wrapper.find("[data-testid='test-content']").exists()).toBe(true);
  });

  it("should not apply data-testid to the body paragraph when textTestId is not provided.", async() => {
    await wrapper.setProps({ textTestId: undefined });

    expect(wrapper.find("p[data-testid]").exists()).toBe(false);
  });

  it("should apply text-text-answer class to the body paragraph when mounted.", () => {
    expect(wrapper.find("section p:last-child").classes()).toContain("text-text-answer");
  });

  it("should render the label with the neon color class when mounted.", () => {
    const label = wrapper.find("p");

    expect(label.classes()).toContain("text-(color:--game-theme-neon)");
  });
});