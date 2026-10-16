<script lang="ts" setup>
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import type {
  GameSettingsCognitiveDifficultiesFilterEmits,
  GameSettingsCognitiveDifficultiesFilterProps,
} from "@/components/domain/game/GameSettingsModal/GameSettingsGeneralTab/GameSettingsCognitiveDifficultiesFilter/game-settings-cognitive-difficulties-filter.types";
import { getDifficultyIcon, getDifficultyIconColor, isQuestionCognitiveDifficulty } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameSettingsCognitiveDifficultiesFilterProps>();
const emit = defineEmits<GameSettingsCognitiveDifficultiesFilterEmits>();
const { t } = useI18n();

const options = computed<GameSettingsFilterOption[]>(() => QUESTION_COGNITIVE_DIFFICULTIES.map(difficulty => ({
  color: getDifficultyIconColor(difficulty),
  icon: getDifficultyIcon(difficulty),
  label: t(`game.settings.cognitiveDifficulties.options.${difficulty}`),
  value: difficulty,
})));

function onUpdateSelectedDifficulties(values: string[]): void {
  emit("update:modelValue", values.filter(isQuestionCognitiveDifficulty));
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