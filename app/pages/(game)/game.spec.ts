import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { useGameMock } from "~~/tests/unit/setup/nuxt/composables/use-game.nuxt.unit-setup";
import { useOverlayMock } from "~~/tests/unit/setup/nuxt/composables/use-overlay.nuxt.unit-setup";
import type { UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

import GamePage from "@/pages/(game)/game.vue";

let capturedLeaveGuard: (() => Promise<boolean>) | undefined;

mockNuxtImport("onBeforeRouteLeave", () => (guard: () => Promise<boolean>): void => {
  capturedLeaveGuard = guard;
});

function getCapturedLeaveGuard(): () => Promise<boolean> {
  if (!capturedLeaveGuard) {
    throw new Error("Expected onBeforeRouteLeave guard to have been captured");
  }
  return capturedLeaveGuard;
}

function getCreatedModalInstance(): UseOverlayCreateReturnValue {
  const createResult = useOverlayMock.instance.create.mock.results[0];

  if (createResult?.type !== "return") {
    throw new Error("Expected overlay.create() to have returned a modal instance");
  }
  return createResult.value;
}

describe("Game Page", () => {
  let wrapper: VueWrapper;

  async function mountGamePage(options: MountSuspendedOptions<typeof GamePage> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    capturedLeaveGuard = undefined;
    wrapper = await mountGamePage();
  });

  it("should render Game Page when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should configure SEO meta tags when mounted.", () => {
    const useHeadMock = vi.mocked(useHead);

    const headInput = useHeadMock.mock.calls[0]?.[0] as
      | { title: () => string; meta: { name?: string; property?: string; content: () => string }[] } |
      undefined;

    expect({
      title: headInput?.title(),
      meta: headInput?.meta.map(entry => (Object.assign(entry, { content: entry.content() }))),
    }).toStrictEqual({
      title: "seo.game.title",
      meta: [
        { name: "description", content: "seo.game.description" },
        { property: "og:title", content: "seo.game.title" },
        { property: "og:description", content: "seo.game.description" },
      ],
    });
  });

  it("should render the page title translation key when mounted.", () => {
    expect(wrapper.text()).toContain("game.pageTitle");
  });

  it("should render GameLoading when gameState is loading.", () => {
    const gameLoading = wrapper.findComponent({ name: "GameLoading" });

    expect(gameLoading.exists()).toBeTruthy();
  });

  it("should render GamePlaying when gameState is playing and a current question exists.", async() => {
    const fakeQuestion = createFakeQuestion();
    useGameMock.instance.questionsRef.value = [fakeQuestion];
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.exists()).toBeTruthy();
  });

  it("should render GameNoMoreQuestions when gameState is game-over.", async() => {
    useGameMock.instance.gameStateRef.value = "game-over";
    await nextTick();

    const noMoreQuestions = wrapper.findComponent({ name: "GameNoMoreQuestions" });

    expect(noMoreQuestions.exists()).toBeTruthy();
  });

  it("should show confirmation when navigating away while gameState is playing.", () => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];

    const guardPromise = getCapturedLeaveGuard()();

    expect(useOverlayMock.instance.create).toHaveBeenCalledExactlyOnceWith(
      expect.any(Object),
      expect.objectContaining({
        props: {
          disableShortcuts: true,
          dismissible: false,
          icon: "i-lucide-log-out",
          iconClass: "text-warning",
          title: "game.leaveConfirmTitle",
          description: "game.leaveConfirmDescription",
          primaryButtonLabel: "game.leave",
        },
      }),
    );

    getCreatedModalInstance().close(true);
    void guardPromise;
  });

  it("should allow navigation when user confirms (Leave) the confirmation.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];

    const guardPromise = getCapturedLeaveGuard()();
    getCreatedModalInstance().close(true);

    const isAllowed = await guardPromise;

    expect(isAllowed).toBe(true);
  });

  it("should cancel navigation when user dismisses (Cancel) the confirmation.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];

    const guardPromise = getCapturedLeaveGuard()();
    getCreatedModalInstance().close(false);

    const isAllowed = await guardPromise;

    expect(isAllowed).toBe(false);
  });

  it("should allow navigation without confirmation when gameState is not playing.", async() => {
    useGameMock.instance.gameStateRef.value = "game-over";

    const isAllowed = await getCapturedLeaveGuard()();

    expect(isAllowed).toBe(true);
  });

  it("should not show overlay when gameState is not playing.", async() => {
    useGameMock.instance.gameStateRef.value = "loading";

    await getCapturedLeaveGuard()();

    expect(useOverlayMock.instance.create).not.toHaveBeenCalled();
  });

  it("should open the sidebar when the toggle button emits click.", async() => {
    const toggleButton = wrapper.findComponent({ name: "GameSidebarToggleButton" });
    getWrapperVm(toggleButton).$emit("click");
    await nextTick();

    const sidebar = wrapper.findComponent({ name: "GameSidebar" });

    expect(sidebar.props("open")).toBe(true);
  });

  it("should close the sidebar when GameSidebar emits update:open with false.", async() => {
    const toggleButton = wrapper.findComponent({ name: "GameSidebarToggleButton" });
    getWrapperVm(toggleButton).$emit("click");
    await nextTick();

    const sidebar = wrapper.findComponent({ name: "GameSidebar" });
    getWrapperVm(sidebar).$emit("update:open", false);
    await nextTick();

    expect(sidebar.props("open")).toBe(false);
  });
});