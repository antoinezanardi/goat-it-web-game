type GameTutorialProps = {
  isActive: boolean;
};

type GameTutorialEmits = {
  tutorialEnd: [];
};

type GameTutorialSpotlightRect = {
  height: number;
  left: number;
  top: number;
  width: number;
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

type GameTutorialStepDirection = "forward" | "backward";

type GameTutorialStep = {
  icon: string;
  key: GameTutorialStepKey;
  target?: string;
};

export type { GameTutorialEmits, GameTutorialProps, GameTutorialSpotlightRect, GameTutorialStep, GameTutorialStepDirection, GameTutorialStepKey };