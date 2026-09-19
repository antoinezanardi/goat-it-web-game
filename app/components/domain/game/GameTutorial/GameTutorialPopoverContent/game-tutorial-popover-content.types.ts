type GameTutorialPopoverContentProps = {
  description: string | undefined;
  hasNext: boolean;
  hasPrev: boolean;
  icon: string | undefined;
  maxHeight: string;
  title: string | undefined;
};

type GameTutorialPopoverContentEmits = {
  back: [];
  finish: [];
  next: [];
  skip: [];
};

export type { GameTutorialPopoverContentEmits, GameTutorialPopoverContentProps };