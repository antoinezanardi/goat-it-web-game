import type { UseGameTutorial, UseGameTutorialOptions } from "@/composables/domain/useGameTutorial/use-game-tutorial.types";

/**
 * Coordinates the interactive tutorial tour for the current question.
 *
 * A sidebar invitation is wired in so the tour can be started from either entry point.
 */
function useGameTutorial(options: UseGameTutorialOptions): UseGameTutorial {
  const isTutorialAvailable = computed<boolean>(() => options.gameState.value === "playing" &&
    options.currentQuestion.value !== undefined &&
    !options.isTranslating.value &&
    !options.isFetchingQuestions.value);
  const isTourRequested = ref<boolean>(false);

  async function startTutorial(): Promise<void> {
    options.closeSidebar();
    isTourRequested.value = false;
    await nextTick();
    isTourRequested.value = true;
  }

  const { acceptFromSidebar } = useGameTutorialInvitation({
    gameState: options.gameState,
    isTutorialAvailable,
    onStartTutorial: () => {
      void startTutorial();
    },
  });

  function startTutorialFromSidebar(): void {
    acceptFromSidebar();
    void startTutorial();
  }

  function endTour(): void {
    isTourRequested.value = false;
  }

  watch(options.currentIndex, () => {
    isTourRequested.value = false;
  });

  return {
    isTutorialAvailable,
    isTourRequested,
    startTutorial,
    startTutorialFromSidebar,
    endTour,
  };
}

export { useGameTutorial };