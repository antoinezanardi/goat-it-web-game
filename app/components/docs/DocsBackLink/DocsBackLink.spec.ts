import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { UButton } from "#components";
import { DocsBackLink } from "#components";

describe("DocsBackLink Component", () => {
  let wrapper: VueWrapper;

  async function mountDocsBackLink(options: MountSuspendedOptions<typeof DocsBackLink> = {}): Promise<VueWrapper> {
    return mountSuspended(DocsBackLink, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountDocsBackLink();
  });

  it("should render a UButton with the backHome label translation key when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>({ name: "UButton" });

    expect(button.props("label")).toBe("docs.backHome");
  });

  it("should render the button with the docs-back-link testid when mounted.", () => {
    expect(wrapper.find("[data-testid='docs-back-link']").exists()).toBe(true);
  });
});