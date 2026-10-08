<script lang="ts" setup>
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";
import type { QuestionCognitiveDifficulty } from "@goat-it/schemas/question";
import { isEqual } from "radashi";

import { ConfirmDialog, GameQuestionsFiltersModalContent, GameQuestionsFiltersModalHeader } from "#components";

import { GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON, GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON_CLASS, GAME_QUESTIONS_FILTERS_MODAL_UI } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.constants";
import type {
  GameQuestionsFiltersDraft,
  GameQuestionsFiltersModalEmits,
  GameQuestionsFiltersModalProps,
} from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.types";
import { GAME_SETTINGS_DEFAULTS } from "~/stores/domain/game-settings/game-settings.constants";

const props = defineProps<GameQuestionsFiltersModalProps>();
const emit = defineEmits<GameQuestionsFiltersModalEmits>();

const { t } = useI18n();
const settingsStore = useGameSettingsStore();
const { activeFiltersCount } = useGameQuestionsFilters();

const overlay = useOverlay();

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

const isDraftModified = computed<boolean>(() => !isEqual(normalizedDraft.value, snapshot.value));

const isApplyDisabled = computed<boolean>(() => props.isApplyPending || !isDraftModified.value);

const isDraftModifiedFromDefaults = computed<boolean>(() => !isEqual(normalizedDraft.value, GAME_SETTINGS_DEFAULTS));

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

async function confirmDiscard(): Promise<boolean> {
  const modal = overlay.create(ConfirmDialog, {
    destroyOnClose: true,
    props: {
      close: false,
      closeButtonLabel: t("game.questionsFilters.discardBack"),
      description: t("game.questionsFilters.discardDescription"),
      disableShortcuts: true,
      icon: GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON,
      iconClass: GAME_QUESTIONS_FILTERS_DISCARD_CONFIRM_ICON_CLASS,
      primaryButtonLabel: t("game.questionsFilters.discardClose"),
      title: t("game.questionsFilters.discardTitle"),
    },
  });

  return await modal.open();
}

async function requestClose(): Promise<void> {
  if (isDraftModified.value) {
    const shouldDiscard = await confirmDiscard();
    if (!shouldDiscard) {
      return;
    }
  }
  emit("update:isOpen", false);
}

function onUpdateOpen(value: boolean): void {
  if (value) {
    emit("update:isOpen", true);

    return;
  }
  void requestClose();
}

function onCloseModal(): void {
  void requestClose();
}

function onAdultContentChange(value: boolean): void {
  draft.value = { ...draft.value, isAdultContentEnabled: value };
}

function onCognitiveDifficultiesChange(value: QuestionCognitiveDifficulty[]): void {
  draft.value = { ...draft.value, cognitiveDifficulties: value };
}

function onReset(): void {
  draft.value = {
    isAdultContentEnabled: GAME_SETTINGS_DEFAULTS.isAdultContentEnabled,
    cognitiveDifficulties: [...GAME_SETTINGS_DEFAULTS.cognitiveDifficulties],
  };
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
      <GameQuestionsFiltersModalHeader
        :applied-count="activeFiltersCount"
        :is-reset-visible="isDraftModifiedFromDefaults"
        @reset="onReset"
      />
    </template>

    <template #body>
      <GameQuestionsFiltersModalContent
        :draft="draft"
        @update:cognitive-difficulties="onCognitiveDifficultiesChange"
        @update:is-adult-content-enabled="onAdultContentChange"
      />
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