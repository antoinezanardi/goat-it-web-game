<script lang="ts" setup>
import type { GameQuestionCardThemeHeaderProps } from "./game-question-card-theme-header.types";

const props = defineProps<GameQuestionCardThemeHeaderProps>();
</script>

<template>
  <header class="flex gap-3 items-center">
    <span
      class="bg-content border border-[var(--game-theme-border)] flex items-center justify-center rounded-lg shadow-[0_0_8px_var(--game-theme-glow-soft)] shrink-0 size-10"
    >
      <UIcon
        class="size-8 text-[var(--game-theme-neon)]"
        :name="props.icon"
      />
    </span>

    <div class="min-w-0">
      <p class="font-semibold leading-[1.4] text-[var(--game-theme-neon)] text-base">
        {{ props.theme.label }}
      </p>

      <p class="flex gap-1.5 items-center leading-[1.4] mt-0.5 text-text-secondary text-xs">
        <UIcon
          class="size-3.5 text-text-secondary"
          name="i-lucide-gauge"
        />

        <span>{{ $t("questions.difficulty.label") }} : {{ $t(`questions.difficulty.${props.difficulty}`) }}</span>
      </p>
    </div>
  </header>
</template>