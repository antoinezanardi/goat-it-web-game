const GAME_TUTORIAL_NAME = "game-tutorial";

const GAME_TUTORIAL_STEPS = [
  {
    key: "welcome",
    target: undefined,
  },
  {
    key: "framework",
    target: "[data-testid='game-question-theme']",
  },
  {
    key: "question",
    target: "[data-testid='game-question-statement']",
  },
  {
    key: "clues",
    target: "[data-testid='game-question-body']",
  },
  {
    key: "answer",
    target: "[data-testid='game-question-answer']",
  },
  {
    key: "sources",
    target: "[data-testid='game-question-source-links']",
  },
  {
    key: "continue",
    target: "[data-testid='game-next-question-button']",
  },
  {
    key: "sidebar",
    target: "[data-testid='game-sidebar-toggle-button']",
  },
] as const;

export { GAME_TUTORIAL_NAME, GAME_TUTORIAL_STEPS };