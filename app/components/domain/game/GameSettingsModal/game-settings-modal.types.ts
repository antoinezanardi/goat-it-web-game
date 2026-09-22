type GameSettingsModalProps = {
  open: boolean;
  isFetchingQuestions: boolean;
};

type GameSettingsModalEmits = {
  "update:open": [value: boolean];
};

export type { GameSettingsModalEmits, GameSettingsModalProps };