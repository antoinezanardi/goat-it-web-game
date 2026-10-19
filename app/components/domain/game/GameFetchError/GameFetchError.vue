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
  <div
    class="flex flex-1 flex-col gap-6 items-center justify-center px-4 py-6"
    data-testid="game-fetch-error"
  >
    <UIcon
      aria-hidden="true"
      class="size-20"
      :name="GAME_FETCH_ERROR_ICON"
    />

    <div class="flex flex-col gap-2 items-center max-w-md">
      <p class="font-medium text-center text-fg-primary text-xl">
        {{ t("game.fetchError.title") }}
      </p>

      <p class="text-center text-muted">
        {{ t("game.fetchError.description") }}
      </p>
    </div>

    <UButton
      data-testid="game-fetch-error-retry"
      :icon="GAME_FETCH_ERROR_RETRY_ICON"
      :label="t('game.fetchError.retry')"
      size="xl"
      @click="onRetry"
    />
  </div>
</template>