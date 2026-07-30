<script lang="ts" setup>
import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";
import { getCategoryIcon, getDifficultyColor } from "~/composables/domain/question/helpers/question.helpers";
import { getThemeIcon } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardThemeHeaderProps>();

const themeIcon = computed(() => getThemeIcon(props.theme.slug));
</script>

<template>
  <header class="flex gap-3 items-center">
    <span
      class="bg-content border border-(color:--game-theme-border) flex items-center justify-center rounded-lg shadow-[0_0_8px_var(--game-theme-glow-soft)] shrink-0 size-10"
    >
      <UIcon
        class="size-8 text-(color:--game-theme-neon)"
        :name="themeIcon"
      />
    </span>

    <div class="min-w-0">
      <p class="font-semibold leading-[1.4] text-(color:--game-theme-neon) text-base">
        {{ props.theme.label }}
      </p>

      <p class="flex gap-1 items-center leading-[1.4] mt-0.5 text-sm">
        <UIcon
          class="size-4 text-(color:--game-theme-neon)"
          :name="getCategoryIcon(props.category)"
        />

        <span class="font-medium text-(color:--game-theme-neon)">{{ $t(`questions.category.${props.category}`) }}</span>
      </p>
    </div>

    <UBadge
      class="ml-auto"
      :color="getDifficultyColor(props.difficulty)"
      :label="$t(`questions.difficulty.${props.difficulty}`)"
      size="lg"
      variant="subtle"
    />
  </header>
</template>