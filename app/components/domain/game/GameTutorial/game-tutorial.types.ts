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
  "filters" |
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

type GameTutorialPopoverContentConfig = {
  "side": "bottom" | "top";
  "sideOffset": number;
  "aria-label": string | undefined;
  "onEscapeKeyDown": (event: KeyboardEvent) => void;
};

export type { GameTutorialEmits, GameTutorialPopoverContentConfig, GameTutorialProps, GameTutorialSpotlightRect, GameTutorialStep, GameTutorialStepKey };