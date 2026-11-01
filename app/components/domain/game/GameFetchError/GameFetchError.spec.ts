import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { UButton, UIcon } from "#components";
import { GameFetchError, StatusScreen } from "#components";

import { GAME_FETCH_ERROR_ICON, GAME_FETCH_ERROR_RETRY_ICON } from "@/components/domain/game/GameFetchError/game-fetch-error.constants";

describe("GameFetchError Component", () => {
  let wrapper: VueWrapper;

  async function mountGameFetchError(options: MountSuspendedOptions<typeof GameFetchError> = {}): Promise<VueWrapper> {
    return mountSuspended(GameFetchError, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameFetchError();
  });

  it("should render GameFetchError when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).exists()).toBeTruthy();
  });

  it("should pass the fetch error title key to StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).props("title")).toBe("game.fetchError.title");
  });

  it("should pass the fetch error description key to StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).props("description")).toBe("game.fetchError.description");
  });

  it("should pass the fetch error icon to StatusScreen when mounted.", () => {
    expect(wrapper.findComponent(StatusScreen).props("icon")).toBe(GAME_FETCH_ERROR_ICON);
  });

  it("should render the fetch error test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-fetch-error']").exists()).toBeTruthy();
  });

  it("should render the fetch error title test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-fetch-error-title']").text()).toBe("game.fetchError.title");
  });

  it("should render the fetch error description test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-fetch-error-description']").text()).toBe("game.fetchError.description");
  });

  it("should render the fetch error icon when mounted.", () => {
    const icon = wrapper.findComponent<typeof UIcon>({ name: "UIcon" });

    expect(icon.props("name")).toBe(GAME_FETCH_ERROR_ICON);
  });

  it("should render the fetch error title key when mounted.", () => {
    expect(wrapper.text()).toContain("game.fetchError.title");
  });

  it("should render the fetch error description key when mounted.", () => {
    expect(wrapper.text()).toContain("game.fetchError.description");
  });

  it("should render the retry button label key when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>("[data-testid='game-fetch-error-retry']");

    expect(button.props("label")).toBe("game.fetchError.retry");
  });

  it("should render the retry button icon when mounted.", () => {
    const button = wrapper.findComponent<typeof UButton>("[data-testid='game-fetch-error-retry']");

    expect(button.props("icon")).toBe(GAME_FETCH_ERROR_RETRY_ICON);
  });

  it("should render the retry button test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-fetch-error-retry']").exists()).toBeTruthy();
  });

  it("should emit retry when the retry button is clicked.", async() => {
    await wrapper.find("[data-testid='game-fetch-error-retry']").trigger("click");

    expect(wrapper.emitted("retry")).toStrictEqual([[]]);
  });
});