import type { GamePageState } from "@/composables/domain/useGame/use-game.types";
import type { Question } from "#shared/types/question.types";

type UseGameTutorialOptions = {
  gameState: Readonly<Ref<GamePageState>>;
  /** Changing it cancels any pending tour request. */
  currentIndex: Ref<number>;
  currentQuestion: Readonly<Ref<Question | undefined>>;
  isFetchingQuestions: Readonly<Ref<boolean>>;
  isTranslating: Readonly<Ref<boolean>>;
  /** Called when the tour starts so the sidebar does not cover it. */
  closeSidebar: () => void;
};

/**
 * Tutorial state and controls returned by `useGameTutorial`.
 */
type UseGameTutorial = {
  /** True only while playing with a current question and no question fetch or translation in progress. */
  isTutorialAvailable: ComputedRef<boolean>;
  /** True while the tour should run. */
  isTourRequested: Ref<boolean>;
  /** Closes the sidebar, clears the previous request, waits a tick, then requests the tour. */
  startTutorial: () => Promise<void>;
  /** Accepts the sidebar invitation, then starts the tour. */
  startTutorialFromSidebar: () => void;
  /** Clears the tour request without changing availability. */
  endTour: () => void;
};

export type { UseGameTutorial, UseGameTutorialOptions };