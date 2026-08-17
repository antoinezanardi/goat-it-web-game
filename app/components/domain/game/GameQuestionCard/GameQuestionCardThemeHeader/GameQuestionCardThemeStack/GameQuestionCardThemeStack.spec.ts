import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { GameQuestionCardThemeStack } from "#components";

import { getThemeIcon } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

type GameQuestionCardThemeStackVm = ComponentVm & { otherThemesLabel: string; toggleOpen: () => void };

describe("GameQuestionCardThemeStack Component", () => {
  const primaryTheme = createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF", label: "Geography" });
  const secondaryThemeOne = createFakeQuestionTheme({ slug: "history-civilizations", color: "#FF5733", label: "History" });
  const secondaryThemeTwo = createFakeQuestionTheme({ slug: "sciences-innovations", color: "#00C853", label: "Science" });

  const defaultProps = {
    question: createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({ isPrimary: true, theme: primaryTheme }),
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondaryThemeOne }),
        createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondaryThemeTwo }),
      ],
    }),
  };

  let wrapper: VueWrapper;

  async function mountStack(options: MountSuspendedOptions<typeof GameQuestionCardThemeStack> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeStack, { props: defaultProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountStack();
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

  it("should not apply the primary z-index class to the secondary icon container when mounted.", () => {
    const secondaryContainer = wrapper.find(`[data-testid='theme-stack-icon-${secondaryThemeOne.slug}']`);

    expect(secondaryContainer.classes()).not.toContain("z-10");
  });

  it("should apply the primary z-index class to the primary icon container when mounted.", () => {
    const primaryContainer = wrapper.find(`[data-testid='theme-stack-icon-${primaryTheme.slug}']`);

    expect(primaryContainer.classes()).toContain("z-10");
  });

  it("should use the card-wide neon style on the primary icon container when mounted.", () => {
    const primaryContainer = wrapper.find(`[data-testid='theme-stack-icon-${primaryTheme.slug}']`);

    expect(primaryContainer.classes()).toContain("border-(color:--game-theme-border)");
  });

  it("should set the secondary icon border color from the theme color when mounted.", () => {
    const secondaryContainer = wrapper.find(`[data-testid='theme-stack-icon-${secondaryThemeOne.slug}']`);

    expect(secondaryContainer.attributes("style")).toContain("border-color: #FF5733");
  });

  it("should expose the other themes label containing the i18n key when mounted.", () => {
    const vm = getWrapperVm<GameQuestionCardThemeStackVm>(wrapper);

    expect(vm.otherThemesLabel).toContain("questions.themeStack.otherThemes");
  });

  it("should toggle the popover open when the stack trigger is clicked.", async() => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    expect(popover.props("open")).toBe(true);
  });

  it("should toggle the popover open when enter is pressed on the stack trigger.", async() => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("keydown.enter");
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

  it("should render a popover row for every theme when opened.", async() => {
    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    const allPopoverContents = [...document.body.querySelectorAll("[data-testid='theme-popover-content']")];
    const popoverContent = allPopoverContents.at(-1);
    const rows = popoverContent?.querySelectorAll("[data-testid='theme-popover-row']");

    expect(rows).toHaveLength(3);
  });

  it("should render the primary theme first in the popover when opened.", async() => {
    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    const allPopoverContents = [...document.body.querySelectorAll("[data-testid='theme-popover-content']")];
    const popoverContent = allPopoverContents.at(-1);
    const firstRow = popoverContent?.querySelector("[data-testid='theme-popover-row']");

    expect(firstRow?.textContent).toContain("Geography");
  });

  it("should render the primary badge only on the primary theme row when opened.", async() => {
    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    const allPopoverContents = [...document.body.querySelectorAll("[data-testid='theme-popover-content']")];
    const popoverContent = allPopoverContents.at(-1);
    const badges = popoverContent?.querySelectorAll("[data-testid='theme-primary-badge']");

    expect(badges).toHaveLength(1);
  });

  it("should render the primary badge on the correct row when opened.", async() => {
    await wrapper.find("[data-testid='theme-stack-trigger']").trigger("click");
    await nextTick();

    const allPopoverContents = [...document.body.querySelectorAll("[data-testid='theme-popover-content']")];
    const popoverContent = allPopoverContents.at(-1);
    const firstBadge = popoverContent?.querySelector("[data-testid='theme-primary-badge']");

    expect(firstBadge?.closest("[data-testid='theme-popover-row']")?.textContent).toContain("Geography");
  });

  it("should render only secondary theme icons when no primary theme is present.", async() => {
    const wrapperNoPrimary = await mountStack({
      props: {
        question: createFakeQuestion({
          themes: [createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondaryThemeOne })],
        }),
      },
    });

    const icons = wrapperNoPrimary.findAllComponents({ name: "UIcon" });

    expect(icons).toHaveLength(1);
  });

  describe("other themes label pluralization", () => {
    it("should call t with a count of 1 when there is one secondary theme.", async() => {
      const i18n = useI18n();
      const tSpy = vi.spyOn(i18n, "t");

      const mountedWrapper = await mountStack({
        props: {
          question: createFakeQuestion({
            themes: [
              createFakeQuestionThemeAssignment({ isPrimary: true, theme: primaryTheme }),
              createFakeQuestionThemeAssignment({ isPrimary: false, theme: secondaryThemeOne }),
            ],
          }),
        },
      });

      const mountedVm = getWrapperVm<GameQuestionCardThemeStackVm>(mountedWrapper);
      void mountedVm.otherThemesLabel;

      expect(tSpy).toHaveBeenCalledWith("questions.themeStack.otherThemes", { count: 1 });
    });

    it("should call t with a count of 2 when there are two secondary themes.", async() => {
      const i18n = useI18n();
      const tSpy = vi.spyOn(i18n, "t");

      const mountedWrapper = await mountStack({
        props: { question: defaultProps.question },
      });

      const mountedVm = getWrapperVm<GameQuestionCardThemeStackVm>(mountedWrapper);
      void mountedVm.otherThemesLabel;

      expect(tSpy).toHaveBeenCalledWith("questions.themeStack.otherThemes", { count: 2 });
    });
  });
});