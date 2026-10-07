<script lang="ts" setup>
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import { GameSettingsAdultContentSwitch, GameSettingsCognitiveDifficultiesFilter } from "#components";

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
</script>

<template>
  <div
    class="flex flex-col gap-3"
    data-testid="game-questions-filters-modal"
  >
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