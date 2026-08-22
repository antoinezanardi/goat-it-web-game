import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardThemeSeparator } from "#components";

describe("GameQuestionCardThemeSeparator Component", () => {
  let wrapper: VueWrapper;

  async function mountGameQuestionCardThemeSeparator(options: MountSuspendedOptions<typeof GameQuestionCardThemeSeparator> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeSeparator, { shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCardThemeSeparator();
  });

  it("should render the separator when mounted.", () => {
    expect(wrapper.find("span").exists()).toBeTruthy();
  });
});