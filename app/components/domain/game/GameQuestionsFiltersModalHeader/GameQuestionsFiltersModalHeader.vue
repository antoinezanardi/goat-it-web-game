<script lang="ts" setup>
import { UButton } from "#components";

import { GAME_QUESTIONS_FILTERS_RESET_BUTTON_UI } from "@/components/domain/game/GameQuestionsFiltersModalHeader/game-questions-filters-modal-header.constants";
import type {
  GameQuestionsFiltersModalHeaderEmits,
  GameQuestionsFiltersModalHeaderProps,
} from "@/components/domain/game/GameQuestionsFiltersModalHeader/game-questions-filters-modal-header.types";

const props = defineProps<GameQuestionsFiltersModalHeaderProps>();
const emit = defineEmits<GameQuestionsFiltersModalHeaderEmits>();
const { t } = useI18n();

function onReset(): void {
  emit("reset");
}
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center w-full">
    <DefaultModalTitle
      class="w-full"
      data-testid="game-questions-filters-modal-title"
      icon="i-lucide-funnel"
      :title="t('game.questionsFilters.title')"
    />

    <GameQuestionsFiltersCountBadge
      v-if="props.appliedCount > 0"
      :count="props.appliedCount"
      data-testid="game-questions-filters-modal-count-badge"
      display-mode="full"
    />

    <UButton
      :class="{ 'invisible opacity-0': !props.isResetVisible }"
      color="neutral"
      data-testid="game-questions-filters-modal-reset-button"
      icon="i-lucide-rotate-ccw"
      :label="t('game.questionsFilters.reset')"
      size="sm"
      :ui="GAME_QUESTIONS_FILTERS_RESET_BUTTON_UI"
      variant="outline"
      @click="onReset"
    />
  </div>
</template>