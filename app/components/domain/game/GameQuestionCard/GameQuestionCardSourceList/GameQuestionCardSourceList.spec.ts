import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardSourceList } from "#components";

import type { GameQuestionCardSourceListProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardSourceList/game-question-card-source-list.types";

describe("GameQuestionCardSourceList Component", () => {
  const defaultGameQuestionCardSourceListProps: GameQuestionCardSourceListProps = {
    sourceUrls: [
      "https://en.wikipedia.org/wiki/Goat",
      "https://www.britannica.com/animal/goat",
    ],
  };

  let wrapper: VueWrapper;

  async function mountSourceList(options: MountSuspendedOptions<typeof GameQuestionCardSourceList> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardSourceList, {
      props: defaultGameQuestionCardSourceListProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountSourceList();
  });

  it("should render GameQuestionCardSourceList when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render a ULink per source URL when sourceUrls are provided.", () => {
    expect(wrapper.findAllComponents({ name: "ULink" })).toHaveLength(2);
  });

  it.each<{ index: number; url: string }>([
    { index: 0, url: "https://en.wikipedia.org/wiki/Goat" },
    { index: 1, url: "https://www.britannica.com/animal/goat" },
  ])("should pass the source URL as the to prop of each ULink when sources are provided.", ({ index, url }) => {
    const links = wrapper.findAllComponents({ name: "ULink" });

    expect(links[index]?.props("to")).toBe(url);
  });

  it("should render a nav element with the correct aria-label when sourceUrls are provided.", () => {
    expect(wrapper.find("nav").attributes("aria-label")).toBe("questions.sourcesAriaLabel");
  });

  it("should render the nav element with the game-question-source-links testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-source-links']").exists()).toBe(true);
  });

  it("should render one link per URL when sourceUrls are provided.", () => {
    expect(wrapper.findAll("a")).toHaveLength(2);
  });

  it("should render the first source domain as the link label when sourceUrls are provided.", () => {
    expect(wrapper.text()).toContain("en.wikipedia.org");
  });

  it("should include the sourceTooltip i18n key in the aria-label of the first link when sourceUrls are provided.", () => {
    expect(wrapper.find("a").attributes("aria-label")).toContain("questions.sourceTooltip");
  });

  it.each<{ sourceUrls: string[] }>([
    { sourceUrls: ["https://en.wikipedia.org/wiki/Goat", "https://www.britannica.com/animal/goat"] },
    { sourceUrls: ["https://en.wikipedia.org/wiki/Goat"] },
  ])("should render the source label key before the colon when sources are provided.", async({ sourceUrls }) => {
    const sourceWrapper = await mountSourceList({ props: { sourceUrls } });
    const label = sourceWrapper.find("[data-testid='game-question-source-label']");

    expect(label.text()).toContain("questions.sourceLabel:");
  });

  it("should wrap each link in a UTooltip when sourceUrls are provided.", () => {
    const tooltips = wrapper.findAllComponents({ name: "UTooltip" });

    expect(tooltips).toHaveLength(2);
  });

  it("should include the UTooltip text with the sourceTooltip i18n key for the first link when sourceUrls are provided.", () => {
    const firstTooltip = wrapper.findAllComponents({ name: "UTooltip" })[0];

    expect(firstTooltip?.props("text")).toBe("questions.sourceTooltip");
  });

  it("should render the external link icon on each link when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "UIcon" });

    for (const icon of icons) {
      expect(icon.props("name")).toBe("i-lucide-external-link");
    }
  });
});