<script lang="ts" setup>
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import {
  GAME_SETTINGS_COGNITIVE_DIFFICULTIES_ALL_SELECTED_KEY,
  GAME_SETTINGS_COGNITIVE_DIFFICULTIES_LABEL_KEY,
  GAME_SETTINGS_COGNITIVE_DIFFICULTIES_OPTIONS_KEY_PREFIX,
} from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsCognitiveDifficultiesFilter/game-settings-cognitive-difficulties-filter.constants";
import { getDifficultyIcon } from "~/composables/domain/question/helpers/question.helpers";

const store = useGameSettingsStore();
const { t } = useI18n();

const options = computed<GameSettingsFilterOption[]>(() => QUESTION_COGNITIVE_DIFFICULTIES.map(difficulty => ({
  icon: getDifficultyIcon(difficulty),
  label: t(`${GAME_SETTINGS_COGNITIVE_DIFFICULTIES_OPTIONS_KEY_PREFIX}.${difficulty}`),
  value: difficulty,
})));

function toCognitiveDifficulties(values: string[]): QuestionCognitiveDifficulty[] {
  return QUESTION_COGNITIVE_DIFFICULTIES.filter(difficulty => values.includes(difficulty));
}

const selectedDifficulties = computed<string[]>({
  get: () => store.settings.cognitiveDifficulties,
  set: (values: string[]) => store.setCognitiveDifficulties(toCognitiveDifficulties(values)),
});
</script>

<template>
  <GameSettingsFilterMultiSelect
    v-model="selectedDifficulties"
    :all-selected-label="t(GAME_SETTINGS_COGNITIVE_DIFFICULTIES_ALL_SELECTED_KEY)"
    data-testid="game-settings-cognitive-difficulties-filter"
    :label="t(GAME_SETTINGS_COGNITIVE_DIFFICULTIES_LABEL_KEY)"
    :options="options"
    summary-mode="labels"
  />
</template>