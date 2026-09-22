import type { GameTutorialStep, GameTutorialStepDirection } from "@/components/domain/game/GameTutorial/game-tutorial.types";

const GAME_TUTORIAL_POPOVER_UI = {
  content: [
    "z-50",
    "data-[state=open]:animate-[scale-in_250ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_200ms_var(--ease-out)]",
    "motion-reduce:data-[state=open]:animate-none! motion-reduce:data-[state=closed]:animate-none!",
  ],
};
const GAME_TUTORIAL_POPOVER_MARGIN = 16;
const GAME_TUTORIAL_POPOVER_MIN_HEIGHT = 160;
const GAME_TUTORIAL_POPOVER_OFFSET = 12;
const GAME_TUTORIAL_SPOTLIGHT_PADDING = 8;
const GAME_TUTORIAL_SPOTLIGHT_PADDING_SIDES = 2;

const GAME_TUTORIAL_ARROW_KEY_DIRECTIONS: Readonly<Record<string, GameTutorialStepDirection>> = {
  ArrowLeft: "backward",
  ArrowRight: "forward",
};

const GAME_TUTORIAL_ACTIVE_CARD_SELECTOR = "[data-testid='game-question']";
const GAME_TUTORIAL_CARD_HEADER_SELECTOR = "[data-testid='game-question-header']";

const GAME_TUTORIAL_STEPS: readonly GameTutorialStep[] = [
  {
    icon: "i-lucide-crown",
    key: "welcome",
  },
  {
    icon: "i-lucide-tag",
    key: "framework",
    target: `${GAME_TUTORIAL_ACTIVE_CARD_SELECTOR} ${GAME_TUTORIAL_CARD_HEADER_SELECTOR}`,
  },
  {
    icon: "i-lucide-message-circle-question-mark",
    key: "question",
    target: `${GAME_TUTORIAL_ACTIVE_CARD_SELECTOR} [data-testid='game-question-statement']`,
  },
  {
    icon: "i-lucide-lightbulb",
    key: "clues",
  },
  {
    icon: "i-lucide-gavel",
    key: "answer",
    target: `${GAME_TUTORIAL_ACTIVE_CARD_SELECTOR} [data-testid='game-question-answer']`,
  },
  {
    icon: "i-lucide-book-marked",
    key: "sources",
    target: `${GAME_TUTORIAL_ACTIVE_CARD_SELECTOR} [data-testid='game-question-source-links']`,
  },
  {
    icon: "i-lucide-arrow-right",
    key: "continue",
    target: "[data-testid='game-next-question-button']",
  },
  {
    icon: "i-lucide-panel-left",
    key: "sidebar",
    target: "[data-testid='game-sidebar-toggle-button']",
  },
];

export {
  GAME_TUTORIAL_ARROW_KEY_DIRECTIONS,
  GAME_TUTORIAL_POPOVER_MARGIN,
  GAME_TUTORIAL_POPOVER_MIN_HEIGHT,
  GAME_TUTORIAL_POPOVER_OFFSET,
  GAME_TUTORIAL_POPOVER_UI,
  GAME_TUTORIAL_SPOTLIGHT_PADDING,
  GAME_TUTORIAL_SPOTLIGHT_PADDING_SIDES,
  GAME_TUTORIAL_STEPS,
};