import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardStatement } from "#components";

import type { GameQuestionCardStatementProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardStatement/game-question-card-statement.types";

describe("GameQuestionCardStatement Component", () => {
  const defaultGameQuestionCardStatementProps: GameQuestionCardStatementProps = {
    text: "What is the capital of France?",
  } as const;

  let wrapper: VueWrapper;

  async function mountStatement(options: MountSuspendedOptions<typeof GameQuestionCardStatement> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardStatement, {
      props: defaultGameQuestionCardStatementProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountStatement();
  });

  it("should render GameQuestionCardStatement when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the question label when mounted.", () => {
    expect(wrapper.text()).toContain("questions.questionLabel");
  });

  it("should render the body text when mounted.", () => {
    expect(wrapper.text()).toContain("What is the capital of France?");
  });

  it("should apply the data-testid attribute to the body paragraph when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-statement']").exists()).toBe(true);
  });

  it("should render the icon when mounted.", () => {
    expect(wrapper.findComponent({ name: "UIcon" }).exists()).toBeTruthy();
  });

  it("should render the icon with the question label icon name when mounted.", () => {
    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe("i-lucide-help-circle");
  });
});