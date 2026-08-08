import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import GamePlaying from "@/components/domain/game/GamePlaying/GamePlaying.vue";

describe("GamePlaying Component", () => {
  const fakeQuestion = createFakeQuestion();
  let wrapper: VueWrapper;

  async function mountGamePlayingComponent(options: MountSuspendedOptions<typeof GamePlaying> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePlaying, { props: { canGoToPreviousQuestion: false, question: fakeQuestion }, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGamePlayingComponent();
  });

  it("should render GameQuestionCard with the correct question prop when mounted.", () => {
    const questionCard = wrapper.findComponent({ name: "GameQuestionCard" });

    expect(questionCard.props("question")).toStrictEqual(fakeQuestion);
  });

  it("should render GameNextQuestionButton when mounted.", () => {
    const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });

    expect(nextButton.exists()).toBeTruthy();
  });

  it("should emit next when GameNextQuestionButton emits click.", () => {
    const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
    getWrapperVm(nextButton).$emit("click");

    expect(wrapper.emitted("next")).toBeDefined();
  });

  it("should not render GamePreviousQuestionButton when canGoToPreviousQuestion is false.", () => {
    const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });

    expect(previousButton.exists()).toBeFalsy();
  });

  it("should render GamePreviousQuestionButton when canGoToPreviousQuestion is true.", async() => {
    await wrapper.setProps({ canGoToPreviousQuestion: true });

    const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });

    expect(previousButton.exists()).toBeTruthy();
  });

  it("should emit previous when GamePreviousQuestionButton emits click.", async() => {
    await wrapper.setProps({ canGoToPreviousQuestion: true });

    const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
    getWrapperVm(previousButton).$emit("click");

    expect(wrapper.emitted("previous")).toBeDefined();
  });
});