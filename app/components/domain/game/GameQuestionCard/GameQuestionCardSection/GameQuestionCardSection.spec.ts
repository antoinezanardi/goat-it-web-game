import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardSection } from "#components";

import type { GameQuestionCardSectionProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardSection/game-question-card-section.types";

const SECTION_SLOT_CONTENT = "What is the capital of France?";

describe("GameQuestionCardSection Component", () => {
  const defaultGameQuestionCardSectionProps: GameQuestionCardSectionProps = {
    dataTestid: "game-question-statement",
    icon: "i-lucide-help-circle",
    label: "questions.questionLabel",
  } as const;

  let wrapper: VueWrapper;

  async function mountGameQuestionCardSection(options: MountSuspendedOptions<typeof GameQuestionCardSection> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardSection, {
      props: defaultGameQuestionCardSectionProps,
      shallow: false,
      slots: { default: SECTION_SLOT_CONTENT },
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCardSection();
  });

  it("should render GameQuestionCardSection when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the label text when mounted.", () => {
    expect(wrapper.text()).toContain("questions.questionLabel");
  });

  it("should render the default slot content when mounted.", () => {
    expect(wrapper.text()).toContain(SECTION_SLOT_CONTENT);
  });

  it("should apply the dataTestid prop to the body paragraph when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-statement']").exists()).toBe(true);
  });

  it("should render the icon with the icon prop name when mounted.", () => {
    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-help-circle");
  });

  it("should apply the new dataTestid to the body paragraph when the dataTestid prop changes.", async() => {
    await wrapper.setProps({ dataTestid: "game-question-answer" });

    expect(wrapper.find("[data-testid='game-question-answer']").exists()).toBe(true);
  });

  it("should render the icon with the new icon name when the icon prop changes.", async() => {
    await wrapper.setProps({ icon: "i-lucide-lightbulb" });

    expect(wrapper.findComponent({ name: "UIcon" }).props("name")).toBe("i-lucide-lightbulb");
  });

  it("should render the new label when the label prop changes.", async() => {
    await wrapper.setProps({ label: "questions.answerLabel" });

    expect(wrapper.text()).toContain("questions.answerLabel");
  });
});