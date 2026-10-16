import type { SelectMenuItem } from "#ui/types";

type GameSettingsFilterSummaryMode = "labels" | "count";

type GameSettingsFilterOption = {
  value: string;
  label: string;
  icon?: string;
  color?: string;
};

type GameSettingsFilterMultiSelectProps = {
  label: string;
  labelIcon?: string;
  options: GameSettingsFilterOption[];
  allSelectedLabel: string;
  summaryMode: GameSettingsFilterSummaryMode;
  modelValue: string[];
  selectTestId?: string;
  summaryTestId?: string;
};

type GameSettingsFilterMultiSelectEmits = {
  "update:modelValue": [value: string[]];
};

type GameSettingsFilterMultiSelectItem = SelectMenuItem & {
  color?: string;
  icon?: string;
  trailingIcon: string;
  value: string;
};

export type {
  GameSettingsFilterMultiSelectEmits,
  GameSettingsFilterMultiSelectProps,
  GameSettingsFilterOption,
  GameSettingsFilterMultiSelectItem,
  GameSettingsFilterSummaryMode,
};