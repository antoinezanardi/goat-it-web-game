<script lang="ts" setup>
import { GAME_FETCH_ERROR_ICON, GAME_FETCH_ERROR_RETRY_ICON } from "@/components/domain/game/GameFetchError/game-fetch-error.constants";
import type { GameFetchErrorEmits } from "@/components/domain/game/GameFetchError/game-fetch-error.types";

const emit = defineEmits<GameFetchErrorEmits>();
const { t } = useI18n();

function onRetry(): void {
  emit("retry");
}
</script>

<template>
  <StatusScreen
    :description="t('game.fetchError.description')"
    :icon="GAME_FETCH_ERROR_ICON"
    test-id="game-fetch-error"
    :title="t('game.fetchError.title')"
  >
    <template #actions>
      <UButton
        data-testid="game-fetch-error-retry"
        :icon="GAME_FETCH_ERROR_RETRY_ICON"
        :label="t('game.fetchError.retry')"
        size="xl"
        @click="onRetry"
      />
    </template>
  </StatusScreen>
</template>