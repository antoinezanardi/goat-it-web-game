import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { computed, nextTick, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { useGameTutorial as UseGameTutorialType } from "@/composables/domain/useGameTutorial/useGameTutorial";
import type { UseGameTutorialOptions } from "@/composables/domain/useGameTutorial/use-game-tutorial.types";
import type { GameTutorialInvitationOptions, UseGameTutorialInvitation } from "@/composables/domain/useGameTutorialInvitation/use-game-tutorial-invitation.types";
import type { GamePageState } from "@/composables/domain/useGame/use-game.types";
import type { Question } from "#shared/types/question.types";

let acceptFromSidebar: Mock<() => void>;
let capturedInvitationOptions: GameTutorialInvitationOptions | undefined;
let useGameTutorial: typeof UseGameTutorialType;

mockNuxtImport("useGameTutorialInvitation", () => (options: GameTutorialInvitationOptions): UseGameTutorialInvitation => {
  capturedInvitationOptions = options;

  return { acceptFromSidebar };
});

let gameState: Ref<GamePageState>;
let currentIndex: Ref<number>;
let currentQuestion: ComputedRef<Question | undefined>;
let isFetchingQuestions: Ref<boolean>;
let isTranslating: Ref<boolean>;
let closeSidebar: Mock<() => void>;

function createOptions(): UseGameTutorialOptions {
  return {
    gameState,
    currentIndex,
    currentQuestion,
    isFetchingQuestions,
    isTranslating,
    closeSidebar,
  };
}

describe("useGameTutorial", () => {
  beforeEach(async() => {
    acceptFromSidebar = vi.fn<() => void>();
    capturedInvitationOptions = undefined;
    gameState = ref<GamePageState>("playing");
    currentIndex = ref<number>(0);
    currentQuestion = computed<Question | undefined>(() => (currentIndex.value === 0 ? createFakeQuestion() : undefined));
    isFetchingQuestions = ref<boolean>(false);
    isTranslating = ref<boolean>(false);
    closeSidebar = vi.fn<() => void>();
    ({ useGameTutorial } = await import("@/composables/domain/useGameTutorial/useGameTutorial"));
  });

  describe("isTutorialAvailable", () => {
    it("should expose the tutorial as unavailable when the game is loading.", () => {
      gameState.value = "loading";
      const { isTutorialAvailable } = useGameTutorial(createOptions());

      expect(isTutorialAvailable.value).toBe(false);
    });

    it("should expose the tutorial as unavailable when playing without a current question.", () => {
      currentIndex.value = 1;
      const { isTutorialAvailable } = useGameTutorial(createOptions());

      expect(isTutorialAvailable.value).toBe(false);
    });

    it("should expose the tutorial as unavailable when the current question is translating.", () => {
      isTranslating.value = true;
      const { isTutorialAvailable } = useGameTutorial(createOptions());

      expect(isTutorialAvailable.value).toBe(false);
    });

    it("should expose the tutorial as unavailable when questions are fetching.", () => {
      isFetchingQuestions.value = true;
      const { isTutorialAvailable } = useGameTutorial(createOptions());

      expect(isTutorialAvailable.value).toBe(false);
    });

    it("should expose the tutorial as available when playing with a current question and no loading state.", () => {
      const { isTutorialAvailable } = useGameTutorial(createOptions());

      expect(isTutorialAvailable.value).toBe(true);
    });

    it("should update the tutorial availability when the translating state changes.", async() => {
      const { isTutorialAvailable } = useGameTutorial(createOptions());
      isTranslating.value = true;
      await nextTick();

      expect(isTutorialAvailable.value).toBe(false);
    });
  });

  describe("invitation wiring", () => {
    it("should configure the tutorial invitation with the provided game state when the tutorial is created.", () => {
      useGameTutorial(createOptions());

      expect(capturedInvitationOptions?.gameState).toBe(gameState);
    });

    it("should close the sidebar when the invitation requests the tutorial.", () => {
      useGameTutorial(createOptions());

      capturedInvitationOptions?.onStartTutorial();

      expect(closeSidebar).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("startTutorial", () => {
    it("should close the sidebar when the tutorial starts.", async() => {
      const { startTutorial } = useGameTutorial(createOptions());

      await startTutorial();

      expect(closeSidebar).toHaveBeenCalledExactlyOnceWith();
    });

    it("should expose the tutorial as requested when the tutorial starts.", async() => {
      const { isTourRequested, startTutorial } = useGameTutorial(createOptions());

      await startTutorial();

      expect(isTourRequested.value).toBe(true);
    });
  });

  describe("startTutorialFromSidebar", () => {
    it("should accept the invitation from the sidebar when the tutorial is started from the sidebar.", () => {
      const { startTutorialFromSidebar } = useGameTutorial(createOptions());

      startTutorialFromSidebar();

      expect(acceptFromSidebar).toHaveBeenCalledExactlyOnceWith();
    });

    it("should request the tutorial when the tutorial is started from the sidebar.", async() => {
      const { isTourRequested, startTutorialFromSidebar } = useGameTutorial(createOptions());

      startTutorialFromSidebar();
      await flushPromises();

      expect(isTourRequested.value).toBe(true);
    });
  });

  describe("endTour", () => {
    it("should expose the tutorial as not requested when the tour ends.", async() => {
      const { endTour, isTourRequested, startTutorial } = useGameTutorial(createOptions());
      await startTutorial();

      endTour();

      expect(isTourRequested.value).toBe(false);
    });
  });

  describe("current question changes", () => {
    it("should reset the requested tutorial when the current question index changes.", async() => {
      const { isTourRequested, startTutorial } = useGameTutorial(createOptions());
      await startTutorial();

      currentIndex.value = 1;
      await nextTick();

      expect(isTourRequested.value).toBe(false);
    });
  });
});