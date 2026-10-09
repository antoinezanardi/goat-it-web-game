<script lang="ts" setup>
import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import {
  GameQuestionsFiltersCategoryFilter,
  GameQuestionsFiltersThemeFilter,
  GameSettingsAdultContentSwitch,
  GameSettingsCognitiveDifficultiesFilter,
} from "#components";

import type {
  GameQuestionsFiltersModalContentEmits,
  GameQuestionsFiltersModalContentProps,
} from "@/components/domain/game/GameQuestionsFiltersModalContent/game-questions-filters-modal-content.types";

const props = defineProps<GameQuestionsFiltersModalContentProps>();
const emit = defineEmits<GameQuestionsFiltersModalContentEmits>();

function onAdultContentChange(value: boolean): void {
  emit("update:isAdultContentEnabled", value);
}

function onCognitiveDifficultiesChange(value: QuestionCognitiveDifficulty[]): void {
  emit("update:cognitiveDifficulties", value);
}

function onCategoriesChange(value: QuestionCategory[]): void {
  emit("update:categories", value);
}

function onThemeIdsChange(value: string[]): void {
  emit("update:themeIds", value);
}
</script>

<template>
  <div
    class="flex flex-col gap-3"
    data-testid="game-questions-filters-modal"
  >
    <GameQuestionsFiltersThemeFilter
      :model-value="props.draft.themeIds"
      @update:model-value="onThemeIdsChange"
    />

    <USeparator/>

    <GameQuestionsFiltersCategoryFilter
      :model-value="props.draft.categories"
      @update:model-value="onCategoriesChange"
    />

    <USeparator/>

    <GameSettingsCognitiveDifficultiesFilter
      :model-value="props.draft.cognitiveDifficulties"
      @update:model-value="onCognitiveDifficultiesChange"
    />

    <USeparator/>

    <GameSettingsAdultContentSwitch
      :is-adult-content-enabled="props.draft.isAdultContentEnabled"
      @update:is-adult-content-enabled="onAdultContentChange"
    />
  </div>
</template>