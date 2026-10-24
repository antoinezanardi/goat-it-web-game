type GameSidebarProps = {
  isGameTutorialAvailable: boolean;
  isSidebarOpen: boolean;
};

type GameSidebarEmits = {
  "update:isSidebarOpen": [value: boolean];
  "startGameTutorial": [];
  "openGameSettings": [];
  "openGameFilters": [];
  "after:leave": [];
  "openChangelog": [];
};

export type { GameSidebarEmits, GameSidebarProps };