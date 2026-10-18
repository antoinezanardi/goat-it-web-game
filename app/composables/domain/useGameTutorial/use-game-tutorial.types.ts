import type { GamePageState } from "@/composables/domain/useGame/use-game.types";
import type { Question } from "#shared/types/question.types";

type UseGameTutorialOptions = {
  gameState: Readonly<Ref<GamePageState>>;
  currentIndex: Ref<number>;
  currentQuestion: Readonly<Ref<Question | undefined>>;
  isFetchingQuestions: Readonly<Ref<boolean>>;
  isTranslating: Readonly<Ref<boolean>>;
  closeSidebar: () => void;
};

type UseGameTutorial = {
  isTutorialAvailable: ComputedRef<boolean>;
  isTourRequested: Ref<boolean>;
  startTutorial: () => Promise<void>;
  startTutorialFromSidebar: () => void;
  endTour: () => void;
};

export type { UseGameTutorial, UseGameTutorialOptions };