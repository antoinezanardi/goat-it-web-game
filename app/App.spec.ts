import type { VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import App from "@/App.vue";

describe("App Component", () => {
  let wrapper: VueWrapper;

  async function mountAppComponent(options: MountSuspendedOptions<typeof App> = {}): Promise<VueWrapper> {
    return mountSuspended(App, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountAppComponent();
  });

  it("should render the app component when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should display the application title when mounted.", () => {
    expect(wrapper.text()).toContain("Goat It Game");
  });
});