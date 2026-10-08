import type { SelectMenuItem } from "#ui/types";

type GameSettingsFilterSummaryMode = "labels" | "count";

type GameSettingsFilterOptionColor = "error" | "success" | "warning";

type GameSettingsFilterOption = {
  value: string;
  label: string;
  icon?: string;
  color?: GameSettingsFilterOptionColor;
};

type GameSettingsFilterMultiSelectProps = {
  label: string;
  labelIcon?: string;
  options: GameSettingsFilterOption[];
  allSelectedLabel: string;
  summaryMode: GameSettingsFilterSummaryMode;
  modelValue: string[];
};

type GameSettingsFilterMultiSelectEmits = {
  "update:modelValue": [value: string[]];
};

type GameSettingsFilterMultiSelectItem = SelectMenuItem & {
  trailingIcon: string;
  value: string;
};

export type {
  GameSettingsFilterMultiSelectEmits,
  GameSettingsFilterMultiSelectProps,
  GameSettingsFilterOption,
  GameSettingsFilterOptionColor,
  GameSettingsFilterMultiSelectItem,
  GameSettingsFilterSummaryMode,
};