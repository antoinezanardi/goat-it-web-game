<script lang="ts" setup>
import { GAME_EMPTY_FILTERS_ICON, GAME_EMPTY_FILTERS_RESET_ICON } from "@/components/domain/game/GameEmptyFilters/game-empty-filters.constants";
import type { GameEmptyFiltersEmits } from "@/components/domain/game/GameEmptyFilters/game-empty-filters.types";

const emit = defineEmits<GameEmptyFiltersEmits>();
const { t } = useI18n();

function onResetFilters(): void {
  emit("resetFilters");
}
</script>

<template>
  <StatusScreen
    :description="t('game.emptyFilters.description')"
    :icon="GAME_EMPTY_FILTERS_ICON"
    test-id="game-empty-filters"
    :title="t('game.emptyFilters.title')"
  >
    <template #actions>
      <UButton
        data-testid="game-empty-filters-reset"
        :icon="GAME_EMPTY_FILTERS_RESET_ICON"
        :label="t('game.emptyFilters.reset')"
        size="xl"
        @click="onResetFilters"
      />
    </template>
  </StatusScreen>
</template>