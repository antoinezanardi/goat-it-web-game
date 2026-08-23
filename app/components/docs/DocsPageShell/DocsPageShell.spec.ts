import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { DocsPageShell } from "#components";

import type { DocsTocSection } from "@/components/docs/DocsToc/docs-toc.types";
import type { DocsPageShellProps } from "@/components/docs/DocsPageShell/docs-page-shell.types";

const defaultSections: DocsTocSection[] = [{ id: "/rules#concept", title: "The concept", level: 2 }];

describe("DocsPageShell Component", () => {
  const defaultDocsPageShellProps: DocsPageShellProps = { sections: defaultSections } as const;

  let wrapper: VueWrapper;

  async function mountDocsPageShell(options: MountSuspendedOptions<typeof DocsPageShell> = {}): Promise<VueWrapper> {
    return mountSuspended(DocsPageShell, {
      props: defaultDocsPageShellProps,
      slots: { default: "<div id='page-content'>Content</div>" },
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountDocsPageShell();
  });

  it("should render DocsPageShell when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the UPage component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UPage" }).exists()).toBe(true);
  });

  it("should render the DocsBackLink components when mounted.", () => {
    expect(wrapper.findAllComponents({ name: "DocsBackLink" })).toHaveLength(2);
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