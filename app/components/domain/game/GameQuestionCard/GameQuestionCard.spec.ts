import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import { GameQuestionCard } from "#components";

describe("GameQuestionCard Component", () => {
  const defaultProps = {
    question: createFakeQuestion(),
  };

  async function mountGameQuestionCard(options: MountSuspendedOptions<typeof GameQuestionCard> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCard, {
      props: defaultProps,
      shallow: false,
      ...options,
    });
  }

  let wrapper: VueWrapper;

  beforeEach(async() => {
    wrapper = await mountGameQuestionCard();
  });

  it("should render the question statement when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-statement']").text()).toBe(defaultProps.question.content.statement);
  });

  it("should render the question answer when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-answer']").text()).toBe(defaultProps.question.content.answer);
  });
});