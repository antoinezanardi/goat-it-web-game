import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import DefaultLayout from "@/layouts/default/DefaultLayout.vue";

describe("DefaultLayout Layout", () => {
  let wrapper: VueWrapper;

  async function mountDefaultLayout(options: MountSuspendedOptions<typeof DefaultLayout> = {}): Promise<VueWrapper> {
    return mountSuspended(DefaultLayout, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountDefaultLayout({
      slots: { default: "<div id='page-content'>Content</div>" },
    });
  });

  it("should render DefaultLayout when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the slot content when mounted.", () => {
    expect(wrapper.find("#page-content").exists()).toBe(true);
  });
});