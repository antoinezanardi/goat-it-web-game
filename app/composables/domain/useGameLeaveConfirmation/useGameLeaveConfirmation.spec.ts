import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { computed, defineComponent, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

import { createUseOverlayMock } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock";
import type { UseOverlayMock } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock";
import type { UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

import type { useGameLeaveConfirmation as UseGameLeaveConfirmationType } from "@/composables/domain/useGameLeaveConfirmation/useGameLeaveConfirmation";
import type { UseGameLeaveConfirmation } from "@/composables/domain/useGameLeaveConfirmation/use-game-leave-confirmation.types";
import type { GamePageState } from "@/composables/domain/useGame/use-game.types";

let useOverlayMock: UseOverlayMock;
let capturedLeaveGuard: (() => Promise<boolean>) | undefined;

mockNuxtImport("useOverlay", () => (): UseOverlayMock => useOverlayMock);

mockNuxtImport("onBeforeRouteLeave", () => (guard: () => Promise<boolean>): void => {
  capturedLeaveGuard = guard;
});

let useGameLeaveConfirmation: typeof UseGameLeaveConfirmationType;
let gameStateValue: Ref<GamePageState>;
let gameState: ComputedRef<GamePageState>;
let leaveConfirmation: UseGameLeaveConfirmation;

function mountLeaveConfirmationHarness(): void {
  mount(defineComponent({
    setup(): () => null {
      leaveConfirmation = useGameLeaveConfirmation({ gameState });

      return (): null => null;
    },
  }));
}

function getCapturedLeaveGuard(): () => Promise<boolean> {
  if (!capturedLeaveGuard) {
    throw new Error("Expected onBeforeRouteLeave guard to have been captured");
  }
  return capturedLeaveGuard;
}

function getCreatedModalInstance(): UseOverlayCreateReturnValue {
  const createResult = useOverlayMock.create.mock.results[0];

  if (createResult?.type !== "return") {
    throw new Error("Expected overlay.create() to have returned a modal instance");
  }
  return createResult.value;
}

describe("useGameLeaveConfirmation", () => {
  beforeEach(async() => {
    capturedLeaveGuard = undefined;
    useOverlayMock = createUseOverlayMock();
    gameStateValue = ref<GamePageState>("loading");
    gameState = computed<GamePageState>(() => gameStateValue.value);
    ({ useGameLeaveConfirmation } = await import("@/composables/domain/useGameLeaveConfirmation/useGameLeaveConfirmation"));
    mountLeaveConfirmationHarness();
  });

  it("should expose the leave confirmation as closed when created.", () => {
    expect(leaveConfirmation.isLeaveConfirmationOpen.value).toBe(false);
  });

  it("should show the confirmation with the localized props when navigating away while the game is playing.", () => {
    gameStateValue.value = "playing";

    const guardPromise = getCapturedLeaveGuard()();

    expect(useOverlayMock.create).toHaveBeenCalledExactlyOnceWith(
      expect.any(Object),
      {
        destroyOnClose: true,
        props: {
          disableShortcuts: true,
          dismissible: false,
          icon: "i-lucide-log-out",
          iconClass: "text-warning",
          title: "game.leaveConfirmTitle",
          description: "game.leaveConfirmDescription",
          primaryButtonLabel: "game.leave",
        },
      },
    );

    getCreatedModalInstance().close(true);
    void guardPromise;
  });

  it("should allow navigation when the user confirms the confirmation.", async() => {
    gameStateValue.value = "playing";
    const guardPromise = getCapturedLeaveGuard()();

    getCreatedModalInstance().close(true);

    await expect(guardPromise).resolves.toBe(true);
  });

  it("should cancel navigation when the user dismisses the confirmation.", async() => {
    gameStateValue.value = "playing";
    const guardPromise = getCapturedLeaveGuard()();

    getCreatedModalInstance().close(false);

    await expect(guardPromise).resolves.toBe(false);
  });

  it("should allow navigation without confirmation when the game is not playing.", async() => {
    gameStateValue.value = "game-over";

    await expect(getCapturedLeaveGuard()()).resolves.toBe(true);
  });

  it("should not create a confirmation when the game is not playing.", async() => {
    gameStateValue.value = "loading";

    await getCapturedLeaveGuard()();

    expect(useOverlayMock.create).not.toHaveBeenCalled();
  });

  it("should expose the leave confirmation as open when the confirmation awaits a result.", () => {
    gameStateValue.value = "playing";
    const guardPromise = getCapturedLeaveGuard()();

    expect(leaveConfirmation.isLeaveConfirmationOpen.value).toBe(true);

    getCreatedModalInstance().close(false);
    void guardPromise;
  });

  it("should expose the leave confirmation as closed when the confirmation is accepted.", async() => {
    gameStateValue.value = "playing";
    const guardPromise = getCapturedLeaveGuard()();
    getCreatedModalInstance().close(true);

    await guardPromise;

    expect(leaveConfirmation.isLeaveConfirmationOpen.value).toBe(false);
  });

  it("should expose the leave confirmation as closed when the confirmation is cancelled.", async() => {
    gameStateValue.value = "playing";
    const guardPromise = getCapturedLeaveGuard()();
    getCreatedModalInstance().close(false);

    await guardPromise;

    expect(leaveConfirmation.isLeaveConfirmationOpen.value).toBe(false);
  });

  it("should keep the leave confirmation closed when the game is not playing.", async() => {
    gameStateValue.value = "game-over";

    await getCapturedLeaveGuard()();

    expect(leaveConfirmation.isLeaveConfirmationOpen.value).toBe(false);
  });
});