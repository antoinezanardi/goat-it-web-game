import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

type GameSettingsCognitiveDifficultiesFilterProps = {
  modelValue: QuestionCognitiveDifficulty[];
};

type GameSettingsCognitiveDifficultiesFilterEmits = {
  "update:modelValue": [value: QuestionCognitiveDifficulty[]];
};

export type { GameSettingsCognitiveDifficultiesFilterEmits, GameSettingsCognitiveDifficultiesFilterProps };