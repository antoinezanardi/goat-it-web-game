import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { GameQuestionCardThemeStack } from "#components";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { GameQuestionCardThemeStackProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/game-question-card-theme-stack.types";
import type { GameQuestionCardThemeIconSize } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeIcon/game-question-card-theme-icon.types";
import { getThemeIcon } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

type GameQuestionCardThemeStackVm = ComponentVm & { toggleOpen: () => void };

describe("GameQuestionCardThemeStack Component", () => {
  const primaryTheme = createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF", label: "Geography" });
  const secondaryThemeOne = createFakeQuestionTheme({ slug: "history-civilizations", color: "#FF5733", label: "History" });
  const secondaryThemeTwo = createFakeQuestionTheme({ slug: "sciences-innovations", color: "#00C853", label: "Science" });

  const defaultGameQuestionCardThemeStackProps: GameQuestionCardThemeStackProps = {
    question: createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme }),
        createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryThemeOne }),
        createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryThemeTwo }),
      ],
    }),
  } as const;

  let wrapper: VueWrapper;

  async function mountStack(options: MountSuspendedOptions<typeof GameQuestionCardThemeStack> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeStack, { props: defaultGameQuestionCardThemeStackProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountStack();
  });

  it("should render GameQuestionCardThemeStack when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the theme stack trigger when mounted.", () => {
    expect(wrapper.find("[data-testid='theme-stack-trigger']").exists()).toBe(true);
  });

  it("should render one icon per theme in the stack when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "UIcon" });

    expect(icons).toHaveLength(3);
  });

  it("should render secondary themes behind the primary theme in the stack when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "UIcon" });

    expect(icons[2]?.props("name")).toBe(getThemeIcon(primaryTheme.slug));
  });

  it("should render secondary themes first in the stack when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "UIcon" });

    expect(icons[0]?.props("name")).toBe(getThemeIcon(secondaryThemeOne.slug));
  });

  it("should apply the primary z-index class to the primary icon container when mounted.", () => {
    const primaryContainer = wrapper.find(`[data-testid='theme-stack-icon-${primaryTheme.slug}']`);

    expect(primaryContainer.classes()).toContain("z-10");
  });

  it("should enable the stack trigger when the question has more than one theme.", () => {
    expect(wrapper.find("[data-testid='theme-stack-trigger']").attributes("disabled")).toBeUndefined();
  });

  it("should toggle the popover open when the stack trigger is clicked.", async() => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    expect(popover.props("open")).toBe(true);
  });

  it("should close the popover when toggleOpen is called while it is open.", async() => {
    const vm = getWrapperVm<GameQuestionCardThemeStackVm>(wrapper);

    vm.toggleOpen();
    await nextTick();

    vm.toggleOpen();
    await nextTick();

    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.props("open")).toBe(false);
  });

  it("should pass the full theme assignment array to the popover content when mounted.", async() => {
    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    const popoverContent = wrapper.findComponent({ name: "GameQuestionCardThemeStackPopoverContent" });

    expect(popoverContent.props("themes")).toStrictEqual(defaultGameQuestionCardThemeStackProps.question.themes);
  });

  it.each<{ index: number; expected: boolean }>([
    { index: 0, expected: false },
    { index: 1, expected: true },
    { index: 2, expected: true },
  ])("should pass isHint $expected to stacked icon at index $index when mounted.", async({ index, expected }) => {
    const wrapperWithHints = await mountStack({
      props: {
        question: createFakeQuestion({
          themes: [
            createFakeQuestionThemeAssignment({ isPrimary: true, isHint: true, theme: primaryTheme }),
            createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryThemeOne }),
            createFakeQuestionThemeAssignment({ isPrimary: false, isHint: true, theme: secondaryThemeTwo }),
          ],
        }),
      },
    });

    const icons = wrapperWithHints.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[index]?.props("isHint")).toBe(expected);
  });

  it.each<{ index: number; expected: GameQuestionCardThemeIconSize }>([
    { index: 0, expected: "sm" },
    { index: 1, expected: "sm" },
    { index: 2, expected: "md" },
  ])("should pass size $expected to stacked icon at index $index when mounted.", ({ index, expected }) => {
    const icons = wrapper.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[index]?.props("size")).toBe(expected);
  });

  it.each<{ index: number; expected: QuestionTheme }>([
    { index: 0, expected: secondaryThemeOne },
    { index: 1, expected: secondaryThemeTwo },
    { index: 2, expected: primaryTheme },
  ])("should pass the stack position at index $index's theme to its theme icon when mounted.", ({ index, expected }) => {
    const icons = wrapper.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[index]?.props("theme")).toBe(expected);
  });

  it("should render only secondary theme icons when no primary theme is present.", async() => {
    const wrapperNoPrimary = await mountStack({
      props: {
        question: createFakeQuestion({
          themes: [createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryThemeOne })],
        }),
      },
    });

    const icons = wrapperNoPrimary.findAllComponents({ name: "UIcon" });

    expect(icons).toHaveLength(1);
  });

  it("should disable the stack trigger when the question has only one theme.", async() => {
    const wrapperSingleTheme = await mountStack({
      props: {
        question: createFakeQuestion({
          themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme })],
        }),
      },
    });

    expect(wrapperSingleTheme.find("[data-testid='theme-stack-trigger']").attributes("disabled")).toBeDefined();
  });

  it("should not open the popover when toggleOpen is called and the question has only one theme.", async() => {
    const wrapperSingleTheme = await mountStack({
      props: {
        question: createFakeQuestion({
          themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme })],
        }),
      },
    });

    const vm = getWrapperVm<GameQuestionCardThemeStackVm>(wrapperSingleTheme);
    vm.toggleOpen();
    await nextTick();

    const popover = wrapperSingleTheme.findComponent({ name: "UPopover" });

    expect(popover.props("open")).toBe(false);
  });
});