import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import type { Ref } from "vue";

import { useCookieMockState } from "~~/tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup";
import { MOCKED_TOAST_ID } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";
import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";

import type { useGameTutorialInvitation as UseGameTutorialInvitationType } from "@/composables/domain/useGameTutorialInvitation/useGameTutorialInvitation";
import type { UseGameTutorialInvitation } from "@/composables/domain/useGameTutorialInvitation/use-game-tutorial-invitation.types";
import type { GamePageState } from "@/composables/domain/useGame/useGame";
import type { Toast } from "#ui/composables";

let useAppToastMock: UseAppToastMock;

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);

let useGameTutorialInvitation: typeof UseGameTutorialInvitationType;
let gameState: Ref<GamePageState>;
let isTutorialAvailable: Ref<boolean>;
let onStartTutorial: Mock<() => void>;
let invitation: UseGameTutorialInvitation;
let wrapper: VueWrapper;

function mountInvitationHarness(): VueWrapper {
  return mount(defineComponent({
    setup(): () => null {
      invitation = useGameTutorialInvitation({ gameState, isTutorialAvailable, onStartTutorial });

      return (): null => null;
    },
  }));
}

async function reachFirstPlayableState(): Promise<void> {
  isTutorialAvailable.value = true;
  gameState.value = "playing";
  await nextTick();
}

function getPresentedInvitationOptions(): Partial<Toast> | undefined {
  return vi.mocked(useAppToastMock.addInfoToast).mock.calls[0]?.[0];
}

function getUpdatedInvitationOptions(callIndex = 0): Omit<Partial<Toast>, "id"> | undefined {
  return vi.mocked(useAppToastMock.updateToast).mock.calls[callIndex]?.[1];
}

function callOnClick(onClick: ((event: MouseEvent) => void) | ((event: MouseEvent) => void)[] | undefined): void {
  if (typeof onClick === "function") {
    onClick(new MouseEvent("click"));

    return;
  }
  if (Array.isArray(onClick)) {
    onClick[0]?.(new MouseEvent("click"));
  }
}

async function clickInvitationAction(index: number): Promise<void> {
  callOnClick(getPresentedInvitationOptions()?.actions?.[index]?.onClick);
  await nextTick();
}

describe("useGameTutorialInvitation", () => {
  beforeEach(async() => {
    useAppToastMock = createUseAppToastMock();
    useCookieMockState.capturedName.current = undefined;
    useCookieMockState.capturedOptions.current = undefined;
    useCookieMockState.cookieRef.value = null;
    gameState = ref<GamePageState>("loading");
    isTutorialAvailable = ref<boolean>(false);
    onStartTutorial = vi.fn<() => void>();
    ({ useGameTutorialInvitation } = await import("@/composables/domain/useGameTutorialInvitation/useGameTutorialInvitation"));
    wrapper = mountInvitationHarness();
  });

  describe("decision cookie", () => {
    it("should read the tutorial decision cookie by name when mounted.", () => {
      expect(useCookieMockState.capturedName.current).toBe("game_tutorial_invitation_decided");
    });

    it("should read the tutorial decision cookie with a 400-day lifetime when mounted.", () => {
      expect(useCookieMockState.capturedOptions.current).toStrictEqual({ path: "/", maxAge: 34_560_000, sameSite: "lax" });
    });
  });

  describe("presentation", () => {
    it("should add the invitation toast with the stable id and sticky informational options when the first playable state is reached.", async() => {
      await reachFirstPlayableState();

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledExactlyOnceWith({
        id: "game-tutorial-invitation",
        title: "game.interactiveTutorial.invitation.title",
        description: "game.interactiveTutorial.invitation.description",
        duration: 0,
        close: false,
        actions: [
          { label: "game.interactiveTutorial.invitation.start", disabled: false, onClick: expect.any(Function) as () => void },
          { label: "game.interactiveTutorial.invitation.notNow", color: "neutral", onClick: expect.any(Function) as () => void },
        ],
        onEscapeKeyDown: expect.any(Function) as (event: Event) => void,
        onSwipeEnd: expect.any(Function) as (event: Event) => void,
      });
    });

    it("should not add the invitation toast when the decision cookie is already set.", async() => {
      useCookieMockState.cookieRef.value = true;

      await reachFirstPlayableState();

      expect(useAppToastMock.addInfoToast).not.toHaveBeenCalled();
    });

    it("should add exactly one invitation toast when playability changes repeatedly.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();
      isTutorialAvailable.value = true;
      await nextTick();

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledOnce();
    });
  });

  describe("start action", () => {
    it("should persist the decision cookie when the start action is invoked while playable.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(0);

      expect(useCookieMockState.cookieRef.value).toBe(true);
    });

    it("should remove the invitation toast when the start action is invoked while playable.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(0);

      expect(useAppToastMock.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
    });

    it("should call the tutorial start callback when the start action is invoked while playable.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(0);

      expect(onStartTutorial).toHaveBeenCalledOnce();
    });

    it("should not call the tutorial start callback when the start action is invoked while unavailable.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();

      await clickInvitationAction(0);

      expect(onStartTutorial).not.toHaveBeenCalled();
    });

    it("should not persist the decision cookie when the start action is invoked while unavailable.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();

      await clickInvitationAction(0);

      expect(useCookieMockState.cookieRef.value).toBeNull();
    });

    it("should not remove the invitation toast when the start action is invoked while unavailable.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();

      await clickInvitationAction(0);

      expect(useAppToastMock.removeToast).not.toHaveBeenCalled();
    });

    it("should call the tutorial start callback exactly once when the start action is invoked twice.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(0);
      await clickInvitationAction(0);

      expect(onStartTutorial).toHaveBeenCalledOnce();
    });
  });

  describe("not now action", () => {
    it("should persist the decision cookie when the not now action is invoked.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(1);

      expect(useCookieMockState.cookieRef.value).toBe(true);
    });

    it("should remove the invitation toast when the not now action is invoked.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(1);

      expect(useAppToastMock.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
    });

    it("should add the sidebar availability toast with the default duration when the not now action is invoked.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(1);

      expect(useAppToastMock.addInfoToast).toHaveBeenNthCalledWith(2, { description: "game.interactiveTutorial.invitation.sidebarAvailable" });
    });

    it("should add the sidebar availability toast exactly once when the not now action is invoked twice.", async() => {
      await reachFirstPlayableState();

      await clickInvitationAction(1);
      await clickInvitationAction(1);

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledTimes(2);
    });
  });

  describe("sidebar acceptance", () => {
    it("should persist the decision cookie when the sidebar accepts the invitation.", async() => {
      await reachFirstPlayableState();

      invitation.acceptFromSidebar();

      expect(useCookieMockState.cookieRef.value).toBe(true);
    });

    it("should remove the invitation toast when the sidebar accepts the invitation.", async() => {
      await reachFirstPlayableState();

      invitation.acceptFromSidebar();

      expect(useAppToastMock.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
    });

    it("should not add the sidebar availability toast when the sidebar accepts the invitation.", async() => {
      await reachFirstPlayableState();

      invitation.acceptFromSidebar();

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledOnce();
    });

    it("should not persist the decision cookie when the sidebar accepts without an active invitation.", () => {
      invitation.acceptFromSidebar();

      expect(useCookieMockState.cookieRef.value).toBeNull();
    });

    it("should not call the tutorial start callback when the start action is invoked after the sidebar accepted the invitation.", async() => {
      await reachFirstPlayableState();
      invitation.acceptFromSidebar();

      await clickInvitationAction(0);

      expect(onStartTutorial).not.toHaveBeenCalled();
    });
  });

  describe("temporary unavailability", () => {
    it("should keep the invitation toast visible when the game becomes temporarily unavailable.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();

      expect(useAppToastMock.removeToast).not.toHaveBeenCalled();
    });

    it("should disable the start action when the game becomes temporarily unavailable.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();

      expect(getUpdatedInvitationOptions()?.actions?.[0]?.disabled).toBe(true);
    });

    it("should enable the start action when the game becomes playable again.", async() => {
      await reachFirstPlayableState();
      isTutorialAvailable.value = false;
      await nextTick();
      isTutorialAvailable.value = true;
      await nextTick();

      expect(getUpdatedInvitationOptions(1)?.actions?.[0]?.disabled).toBe(false);
    });
  });

  describe("game over", () => {
    it("should remove the invitation toast when the game reaches game-over.", async() => {
      await reachFirstPlayableState();
      gameState.value = "game-over";
      isTutorialAvailable.value = false;
      await nextTick();

      expect(useAppToastMock.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
    });

    it("should not persist the decision cookie when the game reaches game-over.", async() => {
      await reachFirstPlayableState();
      gameState.value = "game-over";
      isTutorialAvailable.value = false;
      await nextTick();

      expect(useCookieMockState.cookieRef.value).toBeNull();
    });

    it("should not remove a toast when the game reaches game-over without an active invitation.", async() => {
      gameState.value = "game-over";
      await nextTick();

      expect(useAppToastMock.removeToast).not.toHaveBeenCalled();
    });

    it("should not re-add the invitation toast when a playable state follows game-over.", async() => {
      await reachFirstPlayableState();
      gameState.value = "game-over";
      isTutorialAvailable.value = false;
      await nextTick();
      gameState.value = "playing";
      isTutorialAvailable.value = true;
      await nextTick();

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledOnce();
    });
  });

  describe("cleanup", () => {
    it("should remove the invitation toast when the component unmounts.", async() => {
      await reachFirstPlayableState();

      wrapper.unmount();

      expect(useAppToastMock.removeToast).toHaveBeenCalledExactlyOnceWith(MOCKED_TOAST_ID);
    });

    it("should not persist the decision cookie when the component unmounts.", async() => {
      await reachFirstPlayableState();

      wrapper.unmount();

      expect(useCookieMockState.cookieRef.value).toBeNull();
    });

    it("should not remove a toast when the component unmounts without an active invitation.", () => {
      wrapper.unmount();

      expect(useAppToastMock.removeToast).not.toHaveBeenCalled();
    });

    it("should not call the tutorial start callback when the start action is invoked after the component unmounted.", async() => {
      await reachFirstPlayableState();
      wrapper.unmount();

      await clickInvitationAction(0);

      expect(onStartTutorial).not.toHaveBeenCalled();
    });
  });

  describe("dismissal prevention", () => {
    it("should prevent the default dismissal when the invitation escape key handler is invoked.", async() => {
      await reachFirstPlayableState();
      const event = new KeyboardEvent("keydown", { cancelable: true });

      getPresentedInvitationOptions()?.onEscapeKeyDown?.(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it("should prevent the default dismissal when the invitation swipe end handler is invoked.", async() => {
      await reachFirstPlayableState();
      const event = new Event("swipeend", { cancelable: true });

      getPresentedInvitationOptions()?.onSwipeEnd?.(event as unknown as Parameters<NonNullable<Toast["onSwipeEnd"]>>[0]);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe("locale", () => {
    it("should update the invitation toast content when the locale changes.", async() => {
      await reachFirstPlayableState();
      const { locale } = useI18n();

      locale.value = "fr";
      await nextTick();

      expect(getUpdatedInvitationOptions()?.title).toBe("game.interactiveTutorial.invitation.title");
    });

    it("should not add a second invitation toast when the locale changes.", async() => {
      await reachFirstPlayableState();
      const { locale } = useI18n();

      locale.value = "fr";
      await nextTick();

      expect(useAppToastMock.addInfoToast).toHaveBeenCalledOnce();
    });

    it("should not update the invitation toast when the locale changes without an active invitation.", async() => {
      const { locale } = useI18n();

      locale.value = "fr";
      await nextTick();

      expect(useAppToastMock.updateToast).not.toHaveBeenCalled();
    });
  });
});