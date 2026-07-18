<script lang="ts" setup>
import type { GameNextButtonProps } from "./game-next-button.types";

const props = defineProps<GameNextButtonProps>();
const emit = defineEmits<{ click: [] }>();

const buttonUi = computed(() => ({
  base: "ring-0",
  label: "text-text-primary",
  trailingIcon: props.disabled || props.loading ? "" : "text-[var(--game-theme-neon)]",
}));

function onClick(): void {
  emit("click");
}
</script>

<template>
  <UButton
    block
    class="bg-surface-interactive font-semibold h-10 md:self-end md:w-auto rounded-lg text-sm text-text-primary"
    :class="props.disabled || props.loading ? '' : 'game-next-button--themed'"
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