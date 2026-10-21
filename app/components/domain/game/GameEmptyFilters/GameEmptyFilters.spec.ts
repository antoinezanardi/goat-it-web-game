import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { UButton, UIcon } from "#components";
import { GameEmptyFilters } from "#components";

import { GAME_EMPTY_FILTERS_ICON, GAME_EMPTY_FILTERS_RESET_ICON } from "@/components/domain/game/GameEmptyFilters/game-empty-filters.constants";

describe("GameEmptyFilters Component", () => {
  let wrapper: VueWrapper;

  async function mountGameEmptyFilters(options: MountSuspendedOptions<typeof GameEmptyFilters> = {}): Promise<VueWrapper> {
    return mountSuspended(GameEmptyFilters, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameEmptyFilters();
  });

  it("should render GameEmptyFilters when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the empty filters test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-empty-filters']").exists()).toBeTruthy();
  });

  it("should render the empty filters icon when mounted.", () => {
    const icon = wrapper.findComponent<typeof UIcon>({ name: "UIcon" });

    expect(icon.props("name")).toBe(GAME_EMPTY_FILTERS_ICON);
  });

  it("should render the empty filters title key when mounted.", () => {
    expect(wrapper.text()).toContain("game.emptyFilters.title");
  });

  it("should render the empty filters description key when mounted.", () => {
    expect(wrapper.text()).toContain("game.emptyFilters.description");
  });

  it("should render the reset filters button label key when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>("[data-testid='game-empty-filters-reset']");

    expect(button.props("label")).toBe("game.emptyFilters.reset");
  });

  it("should render the reset filters button icon when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>("[data-testid='game-empty-filters-reset']");

    expect(button.props("icon")).toBe(GAME_EMPTY_FILTERS_RESET_ICON);
  });

  it("should render the reset filters button test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-empty-filters-reset']").exists()).toBeTruthy();
  });

  it("should emit resetFilters when the reset button is clicked.", async() => {
    await wrapper.find("[data-testid='game-empty-filters-reset']").trigger("click");

    expect(wrapper.emitted("resetFilters")).toStrictEqual([[]]);
  });
});