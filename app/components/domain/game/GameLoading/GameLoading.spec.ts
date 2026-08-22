import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameLoading, LoadingSpinner } from "#components";

describe("GameLoading Component", () => {
  let wrapper: VueWrapper;

  async function mountGameLoadingComponent(options: MountSuspendedOptions<typeof GameLoading> = {}): Promise<VueWrapper> {
    return mountSuspended(GameLoading, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameLoadingComponent();
  });

  it("should render a LoadingSpinner when mounted.", () => {
    const spinner = wrapper.findComponent(LoadingSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it("should pass the loading questions translation key as the LoadingSpinner label when mounted.", () => {
    const spinner = wrapper.findComponent(LoadingSpinner);

    expect(spinner.props("label")).toBe("game.loadingQuestions");
  });
});