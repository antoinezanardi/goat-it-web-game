import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { GameQuestionCardThemeStackPopoverContent } from "#components";

describe("GameQuestionCardThemeStackPopoverContent Component", () => {
  const primaryTheme = createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF", label: "Geography" });
  const secondaryTheme = createFakeQuestionTheme({ slug: "history-civilizations", color: "#FF5733", label: "History" });

  const defaultProps = {
    themes: [primaryTheme, secondaryTheme],
    primaryThemeSlug: primaryTheme.slug,
  };

  let wrapper: VueWrapper;

  async function mountPopoverContent(options: MountSuspendedOptions<typeof GameQuestionCardThemeStackPopoverContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeStackPopoverContent, { props: defaultProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountPopoverContent();
  });

  it("should render one popover row per theme when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows).toHaveLength(2);
  });

  it("should render the theme label in its row when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.text()).toContain("Geography");
  });

  it("should render the theme icon in its row when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "UIcon" });

    expect(icons[0]?.props("name")).toBe("i-lucide-globe");
  });

  it("should set the icon container border color from the theme color when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.find("span").attributes("style")).toContain("border-color: #33A1FF");
  });

  it("should render the primary badge on the row matching primaryThemeSlug when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.find("[data-testid='theme-primary-badge']").exists()).toBe(true);
  });

  it("should not render the primary badge on rows that do not match primaryThemeSlug when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[1]?.find("[data-testid='theme-primary-badge']").exists()).toBe(false);
  });

  it("should not render any primary badge when primaryThemeSlug is undefined.", async() => {
    await wrapper.setProps({ primaryThemeSlug: undefined });

    expect(wrapper.find("[data-testid='theme-primary-badge']").exists()).toBe(false);
  });
});