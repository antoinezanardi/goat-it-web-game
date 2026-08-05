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
    return mountSuspended(GamePlaying, { props: { question: fakeQuestion }, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGamePlayingComponent();
  });

  it("should render GameQuestionCard with the correct question prop when mounted.", () => {
    const questionCard = wrapper.findComponent({ name: "GameQuestionCard" });

    expect(questionCard.props("question")).toStrictEqual(fakeQuestion);
  });

  it("should render GameNextButton when mounted.", () => {
    const nextButton = wrapper.findComponent({ name: "GameNextButton" });

    expect(nextButton.exists()).toBeTruthy();
  });

  it("should emit next when GameNextButton emits click.", () => {
    const nextButton = wrapper.findComponent({ name: "GameNextButton" });
    getWrapperVm(nextButton).$emit("click");

    expect(wrapper.emitted("next")).toBeDefined();
  });
});