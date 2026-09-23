type GameSettingsModalProps = {
  isOpen: boolean;
  isFetchingQuestions: boolean;
};

type GameSettingsModalEmits = {
  "update:isOpen": [value: boolean];
};

export type { GameSettingsModalEmits, GameSettingsModalProps };