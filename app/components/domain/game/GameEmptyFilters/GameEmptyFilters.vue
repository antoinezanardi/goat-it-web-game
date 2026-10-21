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
  <div
    class="flex flex-1 flex-col gap-6 items-center justify-center px-4 py-6"
    data-testid="game-empty-filters"
  >
    <UIcon
      aria-hidden="true"
      class="size-20"
      :name="GAME_EMPTY_FILTERS_ICON"
    />

    <div class="flex flex-col gap-2 items-center max-w-md">
      <p class="font-medium text-center text-fg-primary text-xl">
        {{ t("game.emptyFilters.title") }}
      </p>

      <p class="text-center text-muted">
        {{ t("game.emptyFilters.description") }}
      </p>
    </div>

    <UButton
      data-testid="game-empty-filters-reset"
      :icon="GAME_EMPTY_FILTERS_RESET_ICON"
      :label="t('game.emptyFilters.reset')"
      size="xl"
      @click="onResetFilters"
    />
  </div>
</template>