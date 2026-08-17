<script lang="ts" setup>
import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";
import { getCategoryIcon, getPrimaryTheme, getSecondaryThemes } from "~/composables/domain/question/helpers/question.helpers";
import { getThemeIcon } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardThemeHeaderProps>();

const category = computed(() => props.question.category);
const difficulty = computed(() => props.question.cognitiveDifficulty);
const primaryTheme = computed(() => getPrimaryTheme(props.question));
const secondaryThemes = computed(() => getSecondaryThemes(props.question));
const themeIcon = computed(() => getThemeIcon(primaryTheme.value?.slug ?? ""));

const themeStackReference = useTemplateRef<{ otherThemesLabel: string; toggleOpen: () => void }>("themeStackRef");

function handleOtherThemesClick(): void {
  themeStackReference.value?.toggleOpen();
}
</script>

<template>
  <header class="flex gap-3 items-center">
    <template v-if="secondaryThemes.length === 0">
      <span
        class="bg-content border border-(color:--game-theme-border) flex items-center justify-center rounded-lg shadow-[0_0_8px_var(--game-theme-glow-soft)] shrink-0 size-10"
      >
        <UIcon
          class="size-8 text-(color:--game-theme-neon)"
          :name="themeIcon"
        />
      </span>
    </template>

    <GameQuestionCardThemeStack
      v-else
      ref="themeStackRef"
      :question="props.question"
    />

    <div class="min-w-0">
      <p
        class="font-semibold leading-snug-plus text-(color:--game-theme-neon) text-base"
        data-testid="game-question-theme"
      >
        {{ primaryTheme?.label }}
      </p>

      <button
        v-if="secondaryThemes.length > 0"
        class="hover:underline leading-snug-plus mt-0.5 text-(color:--game-theme-neon) text-left text-sm"
        data-testid="theme-other-themes-trigger"
        type="button"
        @click="handleOtherThemesClick"
      >
        {{ themeStackReference?.otherThemesLabel }}
      </button>

      <p class="flex gap-1 items-center leading-snug-plus mt-0.5 text-sm">
        <UIcon
          class="size-4 text-(color:--game-theme-neon)"
          :name="getCategoryIcon(category)"
        />

        <span
          class="font-medium text-(color:--game-theme-neon)"
          data-testid="game-question-category"
        >
          {{ $t(`questions.category.${category}`) }}
        </span>
      </p>
    </div>

    <GameQuestionCardDifficultyBadge
      class="ml-auto"
      :difficulty="difficulty"
    />
  </header>
</template>