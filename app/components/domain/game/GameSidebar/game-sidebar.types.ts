type GameSidebarProps = {
  isTutorialAvailable: boolean;
  isOpen: boolean;
};

type GameSidebarEmits = {
  "update:isOpen": [value: boolean];
  "startTutorial": [];
  "openSettings": [];
  "openFilters": [];
  "after:leave": [];
  "openChangelog": [];
};

export type { GameSidebarEmits, GameSidebarProps };