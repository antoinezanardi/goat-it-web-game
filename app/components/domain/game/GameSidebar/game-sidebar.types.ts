type GameSidebarProps = {
  isFetchingQuestions?: boolean;
  open: boolean;
};

type GameSidebarEmits = {
  "update:open": [value: boolean];
};

export type { GameSidebarEmits, GameSidebarProps };