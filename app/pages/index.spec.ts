import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import HomePage from "@/pages/index.vue";

describe("Home Page", () => {
  let wrapper: VueWrapper;

  async function mountHomePage(options: MountSuspendedOptions<typeof HomePage> = {}): Promise<VueWrapper> {
    return mountSuspended(HomePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountHomePage();
  });

  it("should call useHead with a function that returns the page title translation key when mounted.", () => {
    const useHeadFunction = vi.mocked(useHead).mock.calls[0]?.[0] as () => { title?: string };
    const headResult = useHeadFunction?.();

    expect(headResult?.title).toBe("home.pageTitle");
  });

  it("should render a NuxtLink to /game when the page renders.", () => {
    const link = wrapper.findComponent({ name: "NuxtLink" });

    expect(link.attributes("to")).toBe("/game");
  });

  it("should render the game link translation key in the NuxtLink when the page renders.", () => {
    expect(wrapper.text()).toContain("home.gameLink");
  });
});