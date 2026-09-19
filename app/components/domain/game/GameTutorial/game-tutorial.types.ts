type GameTutorialProps = {
  isActive: boolean;
};

type GameTutorialEmits = {
  tutorialEnd: [];
};

type GameTutorialStepKey =
  | "answer" |
  "clues" |
  "continue" |
  "framework" |
  "question" |
  "sidebar" |
  "sources" |
  "welcome";

type GameTutorialStep = {
  icon: string;
  key: GameTutorialStepKey;
  target?: string;
};

export type { GameTutorialEmits, GameTutorialProps, GameTutorialStep, GameTutorialStepKey };