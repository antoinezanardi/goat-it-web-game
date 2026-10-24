import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";
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

import type { GameStateRenderer } from "#components";

import type { AsyncResult } from "#shared/types/async-result.types";
import { StateNames } from "#shared/enums/state.enums";
import GamePage from "@/pages/(game)/game/index.vue";
import { NEUTRAL_GREY_FALLBACK_THEME_COLOR } from "@/utils/ui/question-theme/question-theme.constants";

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
    return mountSuspended(GamePage, { global: { plugins: [createTestingPinia()] }, shallow: true, ...options });
  }

  function getGameStateRendererWrapper(): VueWrapper<InstanceType<typeof GameStateRenderer>> {
    return wrapper.findComponent<typeof GameStateRenderer>({ name: "GameStateRenderer" });
  }

  beforeEach(async() => {
    capturedLeaveGuard = undefined;
    useCookieMockState.cookieRef.value = null;
    clearNuxtState([StateNames.CHANGELOG_IS_OPEN]);
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

  it("should render GameStateRenderer when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameStateRenderer" }).exists()).toBeTruthy();
  });

  it("should forward gameState to GameStateRenderer when the game state changes.", async() => {
    useGameMock.instance.gameStateRef.value = "error";
    await nextTick();

    expect(getGameStateRendererWrapper().props("gameState")).toBe("error");
  });

  it("should forward isTranslating to GameStateRenderer when translating.", async() => {
    useGameMock.instance.isTranslatingRef.value = true;
    await nextTick();

    expect(getGameStateRendererWrapper().props("isTranslating")).toBe(true);
  });

  it("should forward currentQuestion to GameStateRenderer when playing.", async() => {
    const fakeQuestion = createFakeQuestion();
    useGameMock.instance.questionsRef.value = [fakeQuestion];
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    expect(getGameStateRendererWrapper().props("currentQuestion")).toStrictEqual(fakeQuestion);
  });

  it("should forward questions to GameStateRenderer when playing.", async() => {
    const fakeQuestions = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.questionsRef.value = fakeQuestions;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    expect(getGameStateRendererWrapper().props("questions")).toStrictEqual(fakeQuestions);
  });

  it("should forward currentIndex to GameStateRenderer when playing.", async() => {
    useGameMock.instance.questionsRef.value = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.currentIndex.value = 1;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    expect(getGameStateRendererWrapper().props("currentIndex")).toBe(1);
  });

  it("should forward canGoToPreviousQuestion as true to GameStateRenderer when a previous question is available.", async() => {
    useGameMock.instance.questionsRef.value = [createFakeQuestion(), createFakeQuestion()];
    useGameMock.instance.currentIndex.value = 1;
    useGameMock.instance.gameStateRef.value = "playing";
    await nextTick();

    expect(getGameStateRendererWrapper().props("canGoToPreviousQuestion")).toBe(true);
  });

  it("should call advanceToNextQuestion when GameStateRenderer emits advance.", async() => {
    getWrapperVm(getGameStateRendererWrapper()).$emit("advance");
    await nextTick();

    expect(useGameMock.instance.advanceToNextQuestion).toHaveBeenCalledExactlyOnceWith();
  });

  it("should call goToPreviousQuestion when GameStateRenderer emits previous.", async() => {
    getWrapperVm(getGameStateRendererWrapper()).$emit("previous");
    await nextTick();

    expect(useGameMock.instance.goToPreviousQuestion).toHaveBeenCalledExactlyOnceWith();
  });

  it("should call retryQuestionFetch when GameStateRenderer emits retry.", async() => {
    getWrapperVm(getGameStateRendererWrapper()).$emit("retry");
    await nextTick();

    expect(useGameMock.instance.retryQuestionFetch).toHaveBeenCalledExactlyOnceWith();
  });

  it("should call resetFilters when GameStateRenderer emits resetFilters.", async() => {
    getWrapperVm(getGameStateRendererWrapper()).$emit("resetFilters");
    await nextTick();

    expect(useGameMock.instance.resetFilters).toHaveBeenCalledExactlyOnceWith();
  });

  it("should open the sidebar when the toggle button emits click.", async() => {
    const toggleButton = wrapper.findComponent({ name: "GameSidebarToggleButton" });
    getWrapperVm(toggleButton).$emit("click");
    await nextTick();

    const sidebar = wrapper.findComponent({ name: "GameSidebar" });

    expect(sidebar.props("isSidebarOpen")).toBe(true);
  });

  it("should close the sidebar when GameSidebar emits update:isSidebarOpen with false.", async() => {
    const toggleButton = wrapper.findComponent({ name: "GameSidebarToggleButton" });
    getWrapperVm(toggleButton).$emit("click");
    await nextTick();

    const sidebar = wrapper.findComponent({ name: "GameSidebar" });
    getWrapperVm(sidebar).$emit("update:isSidebarOpen", false);
    await nextTick();

    expect(sidebar.props("isSidebarOpen")).toBe(false);
  });

  it("should close the sidebar when GameSidebar emits openGameSettings.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openGameSettings");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isSidebarOpen")).toBe(false);
  });

  it("should open the settings modal when GameSidebar emits openGameSettings.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openGameSettings");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameSettingsModal" }).props("isOpen")).toBe(true);
  });

  it("should close the settings modal when GameSettingsModal emits update:isOpen with false.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openGameSettings");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:isOpen", false);
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSettingsModal" }).props("isOpen")).toBe(false);
  });

  it("should keep the sidebar closed when the settings modal is dismissed.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openGameSettings");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:isOpen", false);
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isSidebarOpen")).toBe(false);
  });

  it("should not synchronize the questions when the settings modal closes.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:isOpen", false);
    await nextTick();

    expect(useGameMock.instance.syncQuestionsWithGameSettings).not.toHaveBeenCalled();
  });

  it("should render the questions filters button when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionsFiltersButton" }).exists()).toBe(true);
  });

  it("should render the questions filters modal when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionsFiltersModal" }).exists()).toBe(true);
  });

  it("should open the filters modal when the filters button emits click.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersButton" })).$emit("click");
    await nextTick();

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersModal" }).props("isFiltersModalOpen")).toBe(true);
  });

  it("should close the filters modal when the filters modal emits update:isFiltersModalOpen with false.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersButton" })).$emit("click");
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersModal" })).$emit("update:isFiltersModalOpen", false);
    await nextTick();

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersModal" }).props("isFiltersModalOpen")).toBe(false);
  });

  it("should pass the apply pending state as isApplyFiltersPending to the filters modal when a refresh is pending.", async() => {
    let resolveSynchronization: ((value: AsyncResult<void>) => void) | undefined;
    useGameMock.instance.syncQuestionsWithGameSettings.mockReturnValue(new Promise<AsyncResult<void>>(resolve => {
      resolveSynchronization = resolve;
    }));
    getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersModal" })).$emit("applyFilters", {
      isAdultContentEnabled: true,
      cognitiveDifficulties: ["easy"],
      categories: ["trivia"],
    });
    await nextTick();

    expect(wrapper.findComponent({ name: "GameQuestionsFiltersModal" }).props("isApplyFiltersPending")).toBe(true);

    resolveSynchronization?.({ ok: true, value: undefined });
    await flushPromises();
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

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isGameTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when playing with no current question.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isGameTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when isTranslating is true.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    useGameMock.instance.isTranslatingRef.value = true;
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isGameTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as false to GameSidebar when isFetchingQuestions is true.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    useGameMock.instance.isFetchingQuestionsRef.value = true;
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isGameTutorialAvailable")).toBe(false);
  });

  it("should pass isTutorialAvailable as true to GameSidebar when playing with a current question and no loading state.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isGameTutorialAvailable")).toBe(true);
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

  it("should pass isActive as true to GameTutorial when GameSidebar emits startGameTutorial.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameTutorial" }).props("isActive")).toBe(true);
  });

  it("should close the sidebar when GameSidebar emits startGameTutorial.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();

    expect(wrapper.findComponent({ name: "GameSidebar" }).props("isSidebarOpen")).toBe(false);
  });

  it("should pass isActive as false to GameTutorial when GameTutorial emits tutorialEnd.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameTutorial" })).$emit("tutorialEnd");
    await nextTick();

    expect(wrapper.findComponent({ name: "GameTutorial" }).props("isActive")).toBe(false);
  });

  it("should pass isActive as false to GameTutorial when the current question index changes.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion(), createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
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
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();

    expect(useGameMock.instance.currentIndex.value).toBe(1);
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
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();

    expect(useCookieMockState.cookieRef.value).toBe(true);
  });

  it("should remove the tutorial invitation toast when the sidebar requests the tutorial while the invitation is visible.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();

    expect(useAppToastMock.instance.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
  });

  it("should not persist the tutorial decision when the sidebar requests the tutorial without an active invitation.", async() => {
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
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

  it("should render the inert page content wrapper when mounted.", () => {
    expect(wrapper.find("[data-testid='game-page-content']").exists()).toBe(true);
  });

  it("should not mark the page content inert when the tutorial is closed.", () => {
    expect(wrapper.find("[data-testid='game-page-content']").attributes("inert")).toBeUndefined();
  });

  it("should mark the page content inert when the tutorial is requested.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();

    expect(wrapper.find("[data-testid='game-page-content']").attributes("inert")).toBe("");
  });

  it("should remove inert from the page content when the tutorial ends.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();
    getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
    await flushPromises();
    getWrapperVm(wrapper.findComponent({ name: "GameTutorial" })).$emit("tutorialEnd");
    await nextTick();

    expect(wrapper.find("[data-testid='game-page-content']").attributes("inert")).toBeUndefined();
  });

  it("should keep GameTutorial outside the inert page content wrapper when the tutorial is available.", async() => {
    useGameMock.instance.gameStateRef.value = "playing";
    useGameMock.instance.questionsRef.value = [createFakeQuestion()];
    await nextTick();

    expect({
      isRendered: wrapper.findComponent({ name: "GameTutorial" }).exists(),
      isInsidePageContent: wrapper.find("[data-testid='game-page-content']").findComponent({ name: "GameTutorial" }).exists(),
    }).toStrictEqual({
      isRendered: true,
      isInsidePageContent: false,
    });
  });

  describe("areShortcutsDisabled state", () => {
    async function reachPlayingState(): Promise<void> {
      useGameMock.instance.gameStateRef.value = "playing";
      useGameMock.instance.questionsRef.value = [createFakeQuestion()];
      await nextTick();
    }

    it("should forward areShortcutsDisabled as false to GameStateRenderer when no blocking state is active.", async() => {
      await reachPlayingState();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GameStateRenderer when the sidebar is open.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the sidebar closes.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
      await nextTick();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("update:isSidebarOpen", false);
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GameStateRenderer when the settings modal is open.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openGameSettings");
      await flushPromises();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the settings modal closes.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openGameSettings");
      await flushPromises();
      getWrapperVm(wrapper.findComponent({ name: "GameSettingsModal" })).$emit("update:isOpen", false);
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GameStateRenderer when the filters modal is open.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersButton" })).$emit("click");
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the filters modal closes.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersButton" })).$emit("click");
      await nextTick();
      getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersModal" })).$emit("update:isFiltersModalOpen", false);
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GameStateRenderer when the interactive tutorial is requested.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
      await flushPromises();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the interactive tutorial ends.", async() => {
      await reachPlayingState();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("startGameTutorial");
      await flushPromises();
      getWrapperVm(wrapper.findComponent({ name: "GameTutorial" })).$emit("tutorialEnd");
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GameStateRenderer when the leave confirmation awaits a result.", async() => {
      await reachPlayingState();
      const guardPromise = getCapturedLeaveGuard()();
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(true);

      getCreatedModalInstance().close(false);
      void guardPromise;
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the leave confirmation is cancelled.", async() => {
      await reachPlayingState();
      const guardPromise = getCapturedLeaveGuard()();
      getCreatedModalInstance().close(false);
      await guardPromise;
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the leave confirmation is accepted.", async() => {
      await reachPlayingState();
      const guardPromise = getCapturedLeaveGuard()();
      getCreatedModalInstance().close(true);
      await guardPromise;
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });

    it("should forward areShortcutsDisabled as true to GameStateRenderer when the changelog is open.", async() => {
      await reachPlayingState();
      useState<boolean>(StateNames.CHANGELOG_IS_OPEN).value = true;
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(true);
    });

    it("should forward areShortcutsDisabled as false to GameStateRenderer when the changelog closes.", async() => {
      await reachPlayingState();
      useState<boolean>(StateNames.CHANGELOG_IS_OPEN).value = true;
      await nextTick();
      useState<boolean>(StateNames.CHANGELOG_IS_OPEN).value = false;
      await nextTick();

      expect(getGameStateRendererWrapper().props("areShortcutsDisabled")).toBe(false);
    });
  });

  describe("question filters discoverability", () => {
    async function requestFiltersFromSidebar(localWrapper: VueWrapper): Promise<void> {
      getWrapperVm(localWrapper.findComponent({ name: "GameSidebar" })).$emit("openGameFilters");
      await nextTick();
    }

    async function emitSidebarAfterLeave(localWrapper: VueWrapper): Promise<void> {
      getWrapperVm(localWrapper.findComponent({ name: "GameSidebar" })).$emit("after:leave");
      await flushPromises();
    }

    function isFiltersModalOpen(localWrapper: VueWrapper): unknown {
      return localWrapper.findComponent({ name: "GameQuestionsFiltersModal" }).props("isFiltersModalOpen");
    }

    it("should close the sidebar when the sidebar emits openGameFilters.", async() => {
      await requestFiltersFromSidebar(wrapper);

      expect(wrapper.findComponent({ name: "GameSidebar" }).props("isSidebarOpen")).toBe(false);
    });

    it("should close the sidebar when GameSidebar emits openChangelog.", async() => {
      getWrapperVm(wrapper.findComponent({ name: "GameSidebarToggleButton" })).$emit("click");
      await nextTick();
      getWrapperVm(wrapper.findComponent({ name: "GameSidebar" })).$emit("openChangelog");
      await nextTick();

      expect(wrapper.findComponent({ name: "GameSidebar" }).props("isSidebarOpen")).toBe(false);
    });

    it("should not open the filters modal when the sidebar emits openFilters but has not left yet.", async() => {
      await requestFiltersFromSidebar(wrapper);

      expect(isFiltersModalOpen(wrapper)).toBe(false);
    });

    it("should open the filters modal when the sidebar emits after:leave after a filters request.", async() => {
      await requestFiltersFromSidebar(wrapper);
      await emitSidebarAfterLeave(wrapper);

      expect(isFiltersModalOpen(wrapper)).toBe(true);
    });

    it("should not open the filters modal when the sidebar emits after:leave without a filters request.", async() => {
      await emitSidebarAfterLeave(wrapper);

      expect(isFiltersModalOpen(wrapper)).toBe(false);
    });

    it("should consume the pending filters request when the sidebar leaves so a later after:leave does not reopen the modal.", async() => {
      await requestFiltersFromSidebar(wrapper);
      await emitSidebarAfterLeave(wrapper);
      getWrapperVm(wrapper.findComponent({ name: "GameQuestionsFiltersModal" })).$emit("update:isFiltersModalOpen", false);
      await nextTick();
      await emitSidebarAfterLeave(wrapper);

      expect(isFiltersModalOpen(wrapper)).toBe(false);
    });
  });
});