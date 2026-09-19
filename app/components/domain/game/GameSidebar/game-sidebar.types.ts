type GameSidebarProps = {
  isFetchingQuestions?: boolean;
  isTutorialAvailable: boolean;
  open: boolean;
};

type GameSidebarEmits = {
  "update:open": [value: boolean];
  "startTutorial": [];
};

export type { GameSidebarEmits, GameSidebarProps };