<script lang="ts" setup>
import { QUESTION_CATEGORIES } from "@goat-it/schemas/question";
import type { QuestionCategory } from "@goat-it/schemas/question";

import type { GameSettingsFilterOption } from "@/components/domain/game/GameSettingsModal/GameSettingsFilterMultiSelect/game-settings-filter-multi-select.types";
import type {
  GameQuestionsFiltersCategoryFilterEmits,
  GameQuestionsFiltersCategoryFilterProps,
} from "@/components/domain/game/GameQuestionsFiltersModalContent/GameQuestionsFiltersCategoryFilter/game-questions-filters-category-filter.types";
import { getCategoryIcon } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameQuestionsFiltersCategoryFilterProps>();
const emit = defineEmits<GameQuestionsFiltersCategoryFilterEmits>();
const { t } = useI18n();

const options = computed<GameSettingsFilterOption[]>(() => QUESTION_CATEGORIES.map(category => ({
  icon: getCategoryIcon(category),
  label: t(`questions.category.${category}`),
  value: category,
})));

function toCategories(values: string[]): QuestionCategory[] {
  return QUESTION_CATEGORIES.filter(category => values.includes(category));
}

function onUpdateSelectedCategories(values: string[]): void {
  emit("update:modelValue", toCategories(values));
}
</script>

<template>
  <GameSettingsFilterMultiSelect
    :all-selected-label="t('game.questionsFilters.categories.allSelected')"
    data-testid="game-questions-filters-category-filter"
    :label="t('game.questionsFilters.categories.label')"
    label-icon="i-lucide-tag"
    :model-value="props.modelValue"
    :options="options"
    select-test-id="game-questions-filters-category-filter-input"
    summary-mode="count"
    summary-test-id="game-questions-filters-category-filter-summary"
    @update:model-value="onUpdateSelectedCategories"
  />
</template>