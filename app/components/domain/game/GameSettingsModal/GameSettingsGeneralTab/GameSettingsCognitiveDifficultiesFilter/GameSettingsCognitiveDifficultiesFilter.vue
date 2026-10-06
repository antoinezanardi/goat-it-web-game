<script lang="ts" setup>
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import { getDifficultyColor, getDifficultyIcon } from "~/composables/domain/question/helpers/question.helpers";

const store = useGameSettingsStore();
const { t } = useI18n();

const options = computed<GameSettingsFilterOption[]>(() => QUESTION_COGNITIVE_DIFFICULTIES.map(difficulty => ({
  color: getDifficultyColor(difficulty),
  icon: getDifficultyIcon(difficulty),
  label: t(`game.settings.cognitiveDifficulties.options.${difficulty}`),
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
    :all-selected-label="t('game.settings.cognitiveDifficulties.allSelected')"
    data-testid="game-settings-cognitive-difficulties-filter"
    :label="t('game.settings.cognitiveDifficulties.label')"
    label-icon="i-lucide-gauge"
    :options="options"
    summary-mode="labels"
  />
</template>