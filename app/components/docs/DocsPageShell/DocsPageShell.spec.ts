import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { DocsPageShell } from "#components";

import type { DocsTocSection } from "@/components/docs/DocsToc/docs-toc.types";

const defaultSections: DocsTocSection[] = [{ id: "/rules#concept", title: "The concept", level: 2 }];

describe("DocsPageShell Component", () => {
  let wrapper: VueWrapper;

  async function mountDocsPageShell(options: MountSuspendedOptions<typeof DocsPageShell> = {}): Promise<VueWrapper> {
    return mountSuspended(DocsPageShell, {
      props: { sections: defaultSections },
      slots: { default: "<div id='page-content'>Content</div>" },
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountDocsPageShell();
  });

  it("should render the DocsBackToTop component when mounted.", () => {
    expect(wrapper.findComponent({ name: "DocsBackToTop" }).exists()).toBe(true);
  });

  it("should render the slot content when mounted.", () => {
    expect(wrapper.find("#page-content").exists()).toBe(true);
  });

  it("should forward the sections to the DocsToc component when mounted.", () => {
    const docsToc = wrapper.findComponent({ name: "DocsToc" });

    expect(docsToc.props("sections")).toStrictEqual(defaultSections);
  });
});