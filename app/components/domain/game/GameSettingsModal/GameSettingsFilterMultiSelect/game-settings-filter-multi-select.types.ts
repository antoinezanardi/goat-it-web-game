type GameSettingsFilterSummaryMode = "labels" | "count";

type GameSettingsFilterOption = {
  value: string;
  label: string;
  icon?: string;
};

type GameSettingsFilterMultiSelectProps = {
  label: string;
  options: GameSettingsFilterOption[];
  allSelectedLabel: string;
  summaryMode: GameSettingsFilterSummaryMode;
  modelValue: string[];
};

type GameSettingsFilterMultiSelectEmits = {
  "update:modelValue": [value: string[]];
};

export type {
  GameSettingsFilterMultiSelectEmits,
  GameSettingsFilterMultiSelectProps,
  GameSettingsFilterOption,
  GameSettingsFilterSummaryMode,
};