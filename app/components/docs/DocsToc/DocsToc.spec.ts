import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { DocsToc } from "#components";

import { DOCS_TOC_UI } from "@/components/docs/DocsToc/docs-toc.constants";
import type { DocsTocProps } from "@/components/docs/DocsToc/docs-toc.types";

describe("DocsToc Component", () => {
  const defaultDocsTocProps: DocsTocProps = {
    sections: [
      { id: "/rules#concept", title: "The concept", level: 2 },
      { id: "/rules#golden-rule", title: "The golden rule", level: 2 },
    ],
  };
  let wrapper: VueWrapper;
  let callHookSpy: ReturnType<typeof vi.spyOn>;

  async function mountDocsToc(options: MountSuspendedOptions<typeof DocsToc> = {}): Promise<VueWrapper> {
    return mountSuspended(DocsToc, { props: defaultDocsTocProps, ...options });
  }

  beforeEach(async() => {
    const nuxtApp = useNuxtApp();
    callHookSpy = vi.spyOn(nuxtApp.hooks, "callHook");
    wrapper = await mountDocsToc();
  });

  it("should render DocsToc when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the docs-toc root element with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='docs-toc']").exists()).toBe(true);
  });

  it("should render UContentToc with the mapped links when mounted.", () => {
    const contentToc = wrapper.findComponent({ name: "UContentToc" });

    expect(contentToc.props("links")).toStrictEqual([
      { id: "concept", text: "The concept", depth: 2 },
      { id: "golden-rule", text: "The golden rule", depth: 2 },
    ]);
  });

  it("should render UContentToc with the onThisPage title translation key when mounted.", () => {
    const contentToc = wrapper.findComponent({ name: "UContentToc" });

    expect(contentToc.props("title")).toBe("docs.onThisPage");
  });

  it("should render UContentToc with the DOCS_TOC_UI ui config when mounted.", () => {
    const contentToc = wrapper.findComponent({ name: "UContentToc" });

    expect(contentToc.props("ui")).toStrictEqual(DOCS_TOC_UI);
  });

  it("should call the page:transition:finish hook when mounted.", () => {
    expect(callHookSpy).toHaveBeenCalledExactlyOnceWith("page:transition:finish");
  });

  it("should call the page:transition:finish hook again when sections change.", async() => {
    await wrapper.setProps({ sections: [...defaultDocsTocProps.sections, { id: "/rules#answer", title: "Finding the answer", level: 2 }] });
    await flushPromises();

    expect(callHookSpy).toHaveBeenNthCalledWith(2, "page:transition:finish");
  });
});