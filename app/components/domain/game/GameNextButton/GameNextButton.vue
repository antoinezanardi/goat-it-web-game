<script lang="ts" setup>
import type { GameNextButtonEmits, GameNextButtonProps } from "@/components/domain/game/GameNextButton/game-next-button.types";

const props = defineProps<GameNextButtonProps>();
const emit = defineEmits<GameNextButtonEmits>();

const buttonClass = computed(() => (props.disabled || props.loading ? "" : "game-next-button--themed"));

const buttonUi = computed(() => ({
  base: "ring-0",
  label: "text-text-primary",
  trailingIcon: props.disabled || props.loading ? "" : "text-(color:--game-theme-neon)",
}));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UButton
    block
    class="bg-surface-interactive font-semibold h-10 md:self-end md:w-auto rounded-lg text-sm text-text-primary"
    :class="buttonClass"
    color="neutral"
    data-testid="game-next-button"
    :disabled="props.disabled"
    :label="$t('game.nextQuestion')"
    :loading="props.loading"
    size="lg"
    trailing-icon="i-lucide-arrow-right"
    type="button"
    :ui="buttonUi"
    variant="outline"
    @click="onClick"
  />
</template>

<style lang="scss" scoped>
.game-next-button--themed {
  border: 1px solid var(--game-theme-border);
  box-shadow: 0 0 8px var(--game-theme-glow-soft);
}
</style>