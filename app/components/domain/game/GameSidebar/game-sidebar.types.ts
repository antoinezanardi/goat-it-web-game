type GameSidebarProps = {
  isTutorialAvailable: boolean;
  open: boolean;
};

type GameSidebarEmits = {
  "update:open": [value: boolean];
  "startTutorial": [];
  "openSettings": [];
};

export type { GameSidebarEmits, GameSidebarProps };