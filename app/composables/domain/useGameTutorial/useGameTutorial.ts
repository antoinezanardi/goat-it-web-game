import { nextTick } from "vue";

import type { UseGameTutorial, UseGameTutorialOptions } from "@/composables/domain/useGameTutorial/use-game-tutorial.types";

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