import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameLoading, LoadingSpinner } from "#components";

import type { GameLoadingProps } from "@/components/domain/game/GameLoading/game-loading.types";

describe("GameLoading Component", () => {
  let wrapper: VueWrapper;

  const defaultGameLoadingProps: GameLoadingProps = {
    isTranslating: false,
  } as const;

  async function mountGameLoadingComponent(options: MountSuspendedOptions<typeof GameLoading> = {}): Promise<VueWrapper> {
    return mountSuspended(GameLoading, { props: defaultGameLoadingProps, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameLoadingComponent();
  });

  it("should render GameLoading when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render a LoadingSpinner when mounted.", () => {
    const spinner = wrapper.findComponent(LoadingSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it("should pass the loading questions translation key as the LoadingSpinner label when mounted.", () => {
    const spinner = wrapper.findComponent(LoadingSpinner);

    expect(spinner.props("label")).toBe("game.loadingQuestions");
  });

  it("should pass the translating questions translation key as the LoadingSpinner label when isTranslating is true.", async() => {
    await wrapper.setProps({ isTranslating: true });
    const spinner = wrapper.findComponent(LoadingSpinner);

    expect(spinner.props("label")).toBe("game.translatingQuestions");
  });
});