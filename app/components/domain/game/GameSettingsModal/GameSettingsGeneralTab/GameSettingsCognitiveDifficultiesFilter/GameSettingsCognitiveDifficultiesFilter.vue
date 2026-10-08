<script lang="ts" setup>
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import type {
  GameSettingsCognitiveDifficultiesFilterEmits,
  GameSettingsCognitiveDifficultiesFilterProps,
} from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsCognitiveDifficultiesFilter/game-settings-cognitive-difficulties-filter.types";
import { getDifficultyColor, getDifficultyIcon } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameSettingsCognitiveDifficultiesFilterProps>();
const emit = defineEmits<GameSettingsCognitiveDifficultiesFilterEmits>();
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

function onUpdateSelectedDifficulties(values: string[]): void {
  emit("update:modelValue", toCognitiveDifficulties(values));
}
</script>

<template>
  <GameSettingsFilterMultiSelect
    :all-selected-label="t('game.settings.cognitiveDifficulties.allSelected')"
    data-testid="game-settings-cognitive-difficulties-filter"
    :label="t('game.settings.cognitiveDifficulties.label')"
    label-icon="i-lucide-gauge"
    :model-value="props.modelValue"
    :options="options"
    summary-mode="labels"
    @update:model-value="onUpdateSelectedDifficulties"
  />
</template>