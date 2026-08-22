type GameSidebarProps = {
  open: boolean;
};

type GameSidebarEmits = {
  "update:open": [value: boolean];
};

export type { GameSidebarEmits, GameSidebarProps };