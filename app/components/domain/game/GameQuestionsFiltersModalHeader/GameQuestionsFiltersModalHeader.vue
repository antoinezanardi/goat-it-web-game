<script lang="ts" setup>
import { UButton } from "#components";

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
      v-if="props.isResetVisible"
      class="me-10 ml-auto"
      color="neutral"
      data-testid="game-questions-filters-modal-reset-button"
      icon="i-lucide-rotate-ccw"
      :label="t('game.questionsFilters.reset')"
      size="sm"
      variant="outline"
      @click="onReset"
    />
  </div>
</template>