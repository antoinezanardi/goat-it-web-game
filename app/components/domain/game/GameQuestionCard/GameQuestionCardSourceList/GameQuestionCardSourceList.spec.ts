import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardSourceList } from "#components";

describe("GameQuestionCardSourceList Component", () => {
  const defaultSourceUrls = [
    "https://en.wikipedia.org/wiki/Goat",
    "https://www.britannica.com/animal/goat",
  ];

  let wrapper: VueWrapper;

  async function mountSourceList(options: MountSuspendedOptions<typeof GameQuestionCardSourceList> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardSourceList, {
      props: { sourceUrls: defaultSourceUrls },
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountSourceList();
  });

  it("should render a nav element with the correct aria-label when sourceUrls are provided.", () => {
    expect(wrapper.find("nav").attributes("aria-label")).toBe("questions.sourcesAriaLabel");
  });

  it("should render one link per URL when sourceUrls are provided.", () => {
    expect(wrapper.findAll("a")).toHaveLength(2);
  });

  it("should render the first source domain as the link label when sourceUrls are provided.", () => {
    expect(wrapper.text()).toContain("en.wikipedia.org");
  });

  it("should set target to _blank on each link when sourceUrls are provided.", () => {
    const links = wrapper.findAll("a");

    for (const link of links) {
      expect(link.attributes("target")).toBe("_blank");
    }
  });

  it("should set rel to noopener noreferrer on each link when sourceUrls are provided.", () => {
    const links = wrapper.findAll("a");

    for (const link of links) {
      expect(link.attributes("rel")).toBe("noopener noreferrer");
    }
  });

  it("should include the source domain in the aria-label of the first link when sourceUrls are provided.", () => {
    expect(wrapper.find("a").attributes("aria-label")).toContain("en.wikipedia.org");
  });

  it("should include the opens-in-new-tab key in the aria-label of the first link when sourceUrls are provided.", () => {
    expect(wrapper.find("a").attributes("aria-label")).toContain("questions.sourceOpensInNewTab");
  });
});