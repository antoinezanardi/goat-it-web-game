import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardStatement } from "#components";

import type { GameQuestionCardStatementProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardStatement/game-question-card-statement.types";

describe("GameQuestionCardStatement Component", () => {
  const defaultProps: GameQuestionCardStatementProps = {
    text: "What is the capital of France?",
    textTestId: "test-content",
  };

  let wrapper: VueWrapper;

  async function mountStatement(options: MountSuspendedOptions<typeof GameQuestionCardStatement> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardStatement, {
      props: defaultProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountStatement();
  });

  it("should render the question label when mounted.", () => {
    expect(wrapper.text()).toContain("questions.questionLabel");
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

  it("should apply text-text-primary class to the body paragraph when mounted.", () => {
    expect(wrapper.find("section p:last-child").classes()).toContain("text-text-primary");
  });

  it("should render the label with the neon color class when mounted.", () => {
    const label = wrapper.find("p");

    expect(label.classes()).toContain("text-(color:--game-theme-neon)");
  });
});