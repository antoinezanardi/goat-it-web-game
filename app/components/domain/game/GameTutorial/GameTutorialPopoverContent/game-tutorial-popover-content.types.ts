type GameTutorialPopoverContentProps = {
  hasNextStep: boolean;
  hasPreviousStep: boolean;
  popoverMaxHeight: string;
  stepDescription: string | undefined;
  stepIcon: string | undefined;
  stepTitle: string | undefined;
};

type GameTutorialPopoverContentEmits = {
  finishTutorial: [];
  goToNextStep: [];
  goToPreviousStep: [];
  skipTutorial: [];
};

export type { GameTutorialPopoverContentEmits, GameTutorialPopoverContentProps };