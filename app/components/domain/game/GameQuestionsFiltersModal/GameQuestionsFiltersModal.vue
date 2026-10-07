<script lang="ts" setup>
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";
import { isEqual } from "radashi";

import { GameSettingsAdultContentSwitch, GameSettingsCognitiveDifficultiesFilter } from "#components";

import { GAME_QUESTIONS_FILTERS_MODAL_UI } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.constants";
import type {
  GameQuestionsFiltersDraft,
  GameQuestionsFiltersModalEmits,
  GameQuestionsFiltersModalProps,
} from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.types";

const props = defineProps<GameQuestionsFiltersModalProps>();
const emit = defineEmits<GameQuestionsFiltersModalEmits>();

const { t } = useI18n();
const settingsStore = useGameSettingsStore();

function readCommittedDraft(): GameQuestionsFiltersDraft {
  return {
    isAdultContentEnabled: settingsStore.settings.isAdultContentEnabled,
    cognitiveDifficulties: [...settingsStore.settings.cognitiveDifficulties],
  };
}

const snapshot = ref<GameQuestionsFiltersDraft>(readCommittedDraft());
const draft = ref<GameQuestionsFiltersDraft>(readCommittedDraft());

const normalizedDraft = computed<GameQuestionsFiltersDraft>(() => ({
  isAdultContentEnabled: draft.value.isAdultContentEnabled,
  cognitiveDifficulties: QUESTION_COGNITIVE_DIFFICULTIES.filter(difficulty => draft.value.cognitiveDifficulties.includes(difficulty)),
}));

const isApplyDisabled = computed<boolean>(() => props.isApplyPending || isEqual(normalizedDraft.value, snapshot.value));

watch(() => props.isOpen, (isOpen: boolean) => {
  if (!isOpen) {
    return;
  }
  const committedDraft = readCommittedDraft();
  snapshot.value = committedDraft;
  draft.value = {
    isAdultContentEnabled: committedDraft.isAdultContentEnabled,
    cognitiveDifficulties: [...committedDraft.cognitiveDifficulties],
  };
});

function onUpdateOpen(value: boolean): void {
  emit("update:isOpen", value);
}

function onCloseModal(): void {
  onUpdateOpen(false);
}

function onAdultContentChange(value: boolean): void {
  draft.value = { ...draft.value, isAdultContentEnabled: value };
}

function onCognitiveDifficultiesChange(value: QuestionCognitiveDifficulty[]): void {
  draft.value = { ...draft.value, cognitiveDifficulties: value };
}

function onApply(): void {
  emit("applyFilters", {
    isAdultContentEnabled: draft.value.isAdultContentEnabled,
    cognitiveDifficulties: [...draft.value.cognitiveDifficulties],
  });
}
</script>

<template>
  <UModal
    :open="props.isOpen"
    :ui="GAME_QUESTIONS_FILTERS_MODAL_UI"
    @update:open="onUpdateOpen"
  >
    <template #title>
      <DefaultModalTitle
        data-testid="game-questions-filters-modal-title"
        icon="i-lucide-funnel"
        :title="t('game.questionsFilters.title')"
      />
    </template>

    <template #body>
      <div
        class="flex flex-col gap-3"
        data-testid="game-questions-filters-modal"
      >
        <GameSettingsCognitiveDifficultiesFilter
          :model-value="draft.cognitiveDifficulties"
          @update:model-value="onCognitiveDifficultiesChange"
        />

        <USeparator/>

        <GameSettingsAdultContentSwitch
          :is-adult-content-enabled="draft.isAdultContentEnabled"
          @update:is-adult-content-enabled="onAdultContentChange"
        />
      </div>
    </template>

    <template #footer>
      <DefaultModalFooter
        data-testid="game-questions-filters-modal-footer"
        disable-shortcuts
        :is-primary-button-disabled="isApplyDisabled"
        :is-primary-button-loading="props.isApplyPending"
        primary-button-icon="i-lucide-check"
        :primary-button-label="t('game.questionsFilters.apply')"
        @close-modal="onCloseModal"
        @primary-button-click="onApply"
      />
    </template>
  </UModal>
</template>