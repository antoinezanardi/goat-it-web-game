import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardContent } from "#components";

import type { GameQuestionCardContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContent/game-question-card-content.types";

describe("GameQuestionCardContent Component", () => {
  const defaultProps: GameQuestionCardContentProps = {
    label: "Question",
    icon: "i-lucide-help-circle",
    text: "What is the capital of France?",
    variant: "question",
    textTestId: "test-content",
  };

  let wrapper: VueWrapper;

  async function mountContent(options: MountSuspendedOptions<typeof GameQuestionCardContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardContent, {
      props: defaultProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountContent();
  });

  it("should render the label text when mounted.", () => {
    expect(wrapper.text()).toContain("Question");
  });

  it("should render the body text when mounted.", () => {
    expect(wrapper.text()).toContain("What is the capital of France?");
  });

  it("should apply the data-testid attribute to the body paragraph when provided.", () => {
    expect(wrapper.find("[data-testid='test-content']").exists()).toBe(true);
  });

  it("should not apply data-testid to the body paragraph when textTestId is not provided.", async() => {
    await wrapper.setProps({ textTestId: undefined });

    expect(wrapper.find("p[data-testid]").exists()).toBe(false);
  });

  it("should apply text-text-primary class when variant is question.", () => {
    expect(wrapper.find("section p:last-child").classes()).toContain("text-text-primary");
  });

  it("should apply text-text-answer class when variant is answer.", async() => {
    await wrapper.setProps({ variant: "answer" });

    expect(wrapper.find("section p:last-child").classes()).toContain("text-text-answer");
  });

  it("should render the label with the neon color class when component is mounted.", () => {
    const label = wrapper.find("p");

    expect(label.classes()).toContain("text-(color:--game-theme-neon)");
  });
});