<script lang="ts" setup>
import type { GameSidebarToggleButtonEmits } from "@/components/domain/game/GameSidebarToggleButton/game-sidebar-toggle-button.types";
import { GAME_SIDEBAR_TOGGLE_BUTTON_UI } from "@/components/domain/game/GameSidebarToggleButton/game-sidebar-toggle-button.constants";

const emit = defineEmits<GameSidebarToggleButtonEmits>();
const { t } = useI18n();

const ariaLabel = computed<string>(() => t("game.menuTooltip"));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UTooltip :text="ariaLabel">
    <UButton
      :aria-label="ariaLabel"
      class="game-question-navigation-button--themed h-10 rounded-full w-10"
      color="neutral"
      data-testid="game-sidebar-toggle-button"
      icon="i-lucide-menu"
      size="lg"
      :ui="GAME_SIDEBAR_TOGGLE_BUTTON_UI"
      variant="outline"
      @click="onClick"
    />
  </UTooltip>
</template>