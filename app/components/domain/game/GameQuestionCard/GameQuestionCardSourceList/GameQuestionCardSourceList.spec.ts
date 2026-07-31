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

  it("should include the sourceTooltip i18n key in the aria-label of the first link when sourceUrls are provided.", () => {
    expect(wrapper.find("a").attributes("aria-label")).toContain("questions.sourceTooltip");
  });

  it("should render the source label key before the colon when multiple sources are provided.", () => {
    const label = wrapper.find("nav span");

    expect(label.text()).toContain("questions.sourceLabel:");
  });

  it("should render the source label key before the colon when a single source is provided.", async() => {
    const singleWrapper = await mountSourceList({
      props: { sourceUrls: ["https://en.wikipedia.org/wiki/Goat"] },
    });
    const label = singleWrapper.find("nav span");

    expect(label.text()).toContain("questions.sourceLabel:");
  });

  it("should apply text-fg-secondary class to the source label when sourceUrls are provided.", () => {
    const label = wrapper.find("nav span");

    expect(label.classes()).toContain("text-fg-secondary");
  });

  it("should apply shrink-0 class to the source label when sourceUrls are provided.", () => {
    const label = wrapper.find("nav span");

    expect(label.classes()).toContain("shrink-0");
  });

  it("should wrap each link in a UTooltip when sourceUrls are provided.", () => {
    const tooltips = wrapper.findAllComponents({ name: "UTooltip" });

    expect(tooltips).toHaveLength(2);
  });

  it("should include the UTooltip text with the sourceTooltip i18n key for the first link when sourceUrls are provided.", () => {
    const firstTooltip = wrapper.findAllComponents({ name: "UTooltip" })[0];

    expect(firstTooltip?.props("text")).toBe("questions.sourceTooltip");
  });
});