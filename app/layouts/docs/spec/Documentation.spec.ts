import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import DocsLayout from "@/layouts/docs.vue";

describe("DocsLayout Layout", () => {
  let wrapper: VueWrapper;

  async function mountDocumentationLayout(options: MountSuspendedOptions<typeof DocsLayout> = {}): Promise<VueWrapper> {
    return mountSuspended(DocsLayout, { shallow: true, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountDocumentationLayout({
      slots: { default: "<div id='page-content'>Content</div>" },
    });
  });

  it("should render the slot content when mounted.", () => {
    expect(wrapper.find("#page-content").exists()).toBe(true);
  });

  it("should render the docs-layout container when mounted.", () => {
    expect(wrapper.find("#docs-layout").exists()).toBe(true);
  });
});