import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardThemeSeparator } from "#components";

describe("GameQuestionCardThemeSeparator Component", () => {
  let wrapper: VueWrapper;

  async function mountSeparator(options: MountSuspendedOptions<typeof GameQuestionCardThemeSeparator> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeSeparator, { shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountSeparator();
  });

  it("should render a container with role presentation when mounted.", () => {
    expect(wrapper.find("[role='presentation']").exists()).toBe(true);
  });

  it("should render a span with the separator background CSS var when component is mounted.", () => {
    const span = wrapper.find(".h-px");

    expect(span.classes()).toContain("bg-[var(--game-theme-separator)]");
  });

  it("should render a span with the separator shadow CSS var when component is mounted.", () => {
    const span = wrapper.find(".h-px");

    expect(span.classes()).toContain("shadow-[0_0_8px_var(--game-theme-separator)]");
  });
});