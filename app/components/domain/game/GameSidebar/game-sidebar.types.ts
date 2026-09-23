type GameSidebarProps = {
  isTutorialAvailable: boolean;
  isOpen: boolean;
};

type GameSidebarEmits = {
  "update:isOpen": [value: boolean];
  "startTutorial": [];
  "openSettings": [];
};

export type { GameSidebarEmits, GameSidebarProps };