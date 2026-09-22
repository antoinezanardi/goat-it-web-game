import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { useGameMock } from "~~/tests/unit/setup/nuxt/composables/use-game.nuxt.unit-setup";
import { useOverlayMock } from "~~/tests/unit/setup/nuxt/composables/use-overlay.nuxt.unit-setup";
import { useAppToastMock } from "~~/tests/unit/setup/nuxt/composables/use-app-toast.nuxt.unit-setup";
import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { MOCKED_TOAST_ID } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";
import type { UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

import type { GamePlaying } from "#components";

import GamePage from "@/pages/(game)/game.vue";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR } from "~/composables/domain/question-theme/constants/question-theme.constants";

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

type GamePageVm = ComponentVm & { pageThemeColor: string };

describe("Game Page", () => {
  let wrapper: VueWrapper;

  async function mountGamePage(options: MountSuspendedOptions<typeof GamePage> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePage, { shallow: true, ...options });
  }

  beforeEach(async() => {
    capturedLeaveGuard = undefined;
    useCookieMockState.cookieRef.value = null;
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

  it("should fall back to the neutral grey theme color when no current question exists.", () => {
    const vm = getWrapperVm<GamePageVm>(wrapper);

    expect(vm.pageThemeColor).toBe(NEUTRAL_GREY_FALLBACK_THEME_COLOR);
  });

  it("should resolve the current question primary theme color when playing.", async() => {
    const fakeQuestion = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment({
          isPrimary: true,
          isHint: false,
          theme: createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF", label: "Geography" }),
        }),
      ],
    });
    useGameMock.instance.questionsRef.value = [fakeQuestion];
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const vm = getWrapperVm<GamePageVm>(wrapper);

    expect(vm.pageThemeColor).toBe("#33A1FF");
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

  it("should forward canGoToPreviousQuestion as true to GamePlaying when a previous question is available.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.questionsRef.value = fakeQuestions;
    useGameMock.instance.currentIndex.value = 1;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("canGoToPreviousQuestion")).toBe(true);
  });

  it("should forward currentIndex to GamePlaying when gameState is playing.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.questionsRef.value = fakeQuestions;
    useGameMock.instance.currentIndex.value = 1;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("currentIndex")).toBe(1);
  });

  it("should forward currentQuestion to GamePlaying when gameState is playing.", async() => {
    const fakeQuestion = createFakeQuestion();
    useGameMock.instance.questionsRef.value = [fakeQuestion];
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("currentQuestion")).toStrictEqual(fakeQuestion);
  });

  it("should forward questions to GamePlaying when gameState is playing.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.questionsRef.value = fakeQuestions;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });

    expect(gamePlaying.props("questions")).toStrictEqual(fakeQuestions);
  });

  it("should call advanceToNextQuestion when GamePlaying emits advance.", async() => {
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });
    getWrapperVm(gamePlaying).$emit("advance");
    await nextTick();

    expect(useGameMock.instance.advanceToNextQuestion).toHaveBeenCalledExactlyOnceWith();
  });

  it("should call goToPreviousQuestion when GamePlaying emits previous.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.questionsRef.value = fakeQuestions;
    useGameMock.instance.currentIndex.value = 1;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    const gamePlaying = wrapper.findComponent({ name: "GamePlaying" });
    getWrapperVm(gamePlaying).$emit("previous");
    await nextTick();

    expect(useGameMock.instance.goToPreviousQuestion).toHaveBeenCalledExactlyOnceWith();
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

  it("should close the sidebar when GameSidebar emits openSettings.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openSettings");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("open")).toBe(false);
  });

  it("should open the settings modal when GameSidebar emits openSettings.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openSettings");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameSettingsModal" }).props("open")).toBe(true);
  });

  it("should close the settings modal when GameSettingsModal emits update:open with false.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openSettings");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:open", false);
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSettingsModal" }).props("open")).toBe(false);
  });

  it("should keep the sidebar closed when the settings modal is dismissed.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openSettings");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:open", false);
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("open")).toBe(false);
  });

  it("should pass isFetchingQuestions as the isFetchingQuestions prop to GameSettingsModal when mounted.", async() => {
    useGameMock.instance.isFetchingQuestionsRef.value = true;
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSettingsModal" }).props("isFetchingQuestions")).toBe(true);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when gameState is loading.", async() => {
    useGameMock.instance.gameStateRef.value = "loading";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when playing with no current question.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when isTranslating is true.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    useGameMock.instance.isTranslatingRef.value = true;
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when isFetchingQuestions is true.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    useGameMock.instance.isFetchingQuestionsRef.value = true;
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as true to GameSidebar when playing with a current question and no loading state.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isTutorialAvailable")).toBe(true);
  });

  it("should render GameTutorial when isTutorialAvailable is true.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameTutorial" }).exists()).toBe(true);
  });

  it("should not render GameTutorial when isTutorialAvailable is false.", async() => {
    useGameMock.instance.gameStateRef.value = "loading";
    await nextTick();

    expect(wrapper.findComponent({ name: "GameTutorial" }).exists()).toBe(false);
  });

  it("should pass isActive as false to GameTutorial when mounted.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameTutorial" }).props("isActive")).toBe(false);
  });

  it("should pass isActive as true to GameTutorial when GameSidebar emits startTutorial.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameTutorial" }).props("isActive")).toBe(true);
  });

  it("should close the sidebar when GameSidebar emits startTutorial.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("open")).toBe(false);
  });

  it("should pass isActive as false to GameTutorial when GameTutorial emits tutorialEnd.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameTutorial" })).$emit("tutorialEnd");
    await nextTick();

    expect(wrapper.findComponent({ name: "GameTutorial" }).props("isActive")).toBe(false);
  });

  it("should pass isActive as false to GameTutorial when the current question index changes.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion(), createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();
    useGameMock.instance.currentIndex.value = 1;
    await nextTick();

    expect(wrapper.findComponent({ name: "GameTutorial" }).props("isActive")).toBe(false);
  });

  it("should not change the current question index when the tutorial is started.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.currentIndex.value = 1;
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();

    expect(useGameMock.instance.currentIndex.value).toBe(1);
  });

  it("should render GameLoading when isTranslating is true even if gameState is playing.", async() => {
    useGameMock.instance.isTranslatingRef.value = true;
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    const gameLoading = wrapper.findComponent({ name: "GameLoading" });

    expect(gameLoading.exists()).toBeTruthy();
  });

  it("should pass isTranslating as the isTranslating prop to GameLoading when isTranslating is true.", async() => {
    useGameMock.instance.isTranslatingRef.value = true;
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    const gameLoading = wrapper.findComponent({ name: "GameLoading" });

    expect(gameLoading.props("isTranslating")).toBe(true);
  });

  it("should present the tutorial invitation when a question becomes playable.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(useAppToastMock.instance.addInfoToast).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ id: "game-tutorial-invitation" }));
  });

  it("should not present the tutorial invitation when the decision cookie is already set.", async() => {
    useCookieMockState.cookieRef.value = true;
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(useAppToastMock.instance.addInfoToast).not.toHaveBeenCalled();
  });

  it("should persist the tutorial decision when the sidebar requests the tutorial while the invitation is visible.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();

    expect(useCookieMockState.cookieRef.value).toBe(true);
  });

  it("should remove the tutorial invitation toast when the sidebar requests the tutorial while the invitation is visible.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();

    expect(useAppToastMock.instance.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  it("should not persist the tutorial decision when the sidebar requests the tutorial without an active invitation.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
    await flushPromises();

    expect(useCookieMockState.cookieRef.value).toBeNull();
  });

  it("should remove the tutorial invitation toast when the game reaches game-over.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    useGameMock.instance.gameStateRef.value = "game-over";
    await nextTick();

    expect(useAppToastMock.instance.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  it("should remove the tutorial invitation toast when the page unmounts.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    wrapper.unmount();

    expect(useAppToastMock.instance.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  describe("areShortcutsDisabled state", () => {
    async function reachPlayingState(): Promise<void> {
      useGameMock.instance.gameStateRef.value = "playing";
      useGameMock.instance.questionsRef.value = [createFakeQuestion()];
      await nextTick();
    }

    function getGamePlayingWrapper(): VueWrapper<InstanceType<typeof GamePlaying>> {
      return wrapper.findComponent<typeof GamePlaying>({ name: "GamePlaying" });
    }

    it("should forward areShortcutsDisabled as false to GamePlaying when no blocking state is active.", async() => {
      await reachPlayingState();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GamePlaying when the sidebar is open.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GamePlaying when the sidebar closes.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
      await nextTick();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("update:open", false);
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GamePlaying when the settings modal is open.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openSettings");
      await flushPromises();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GamePlaying when the settings modal closes.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openSettings");
      await flushPromises();
      getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:open", false);
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GamePlaying when the interactive tutorial is requested.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
      await flushPromises();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GamePlaying when the interactive tutorial ends.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startTutorial");
      await flushPromises();
      getWrapperVm(wrapper.findComponent({ name: "GameTutorial" })).$emit("tutorialEnd");
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GamePlaying when the leave confirmation awaits a result.", async() => {
      await reachPlayingState();
      const guardPromise = getCapturedLeaveGuard()();
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(true);

      getCreatedModalInstance().close(false);
      void guardPromise;
    });

    it("should forward areShortcutsDisabled as false to GamePlaying when the leave confirmation is cancelled.", async() => {
      await reachPlayingState();
      const guardPromise = getCapturedLeaveGuard()();
      getCreatedModalInstance().close(false);
      await guardPromise;
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as false to GamePlaying when the leave confirmation is accepted.", async() => {
      await reachPlayingState();
      const guardPromise = getCapturedLeaveGuard()();
      getCreatedModalInstance().close(true);
      await guardPromise;
      await nextTick();

      expect(getGamePlayingWrapper().props("areShortcutsDisabled")).toBe(false);
    });
  });
});