<script lang="ts" setup>
import { GameQuestionCardThemeStack } from "#components";

import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";
import { getCategoryIcon, getPrimaryTheme, getSecondaryThemes, hasSecondaryThemes } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameQuestionCardThemeHeaderProps>();

const { t } = useI18n();

const category = computed(() => props.question.category);
const difficulty = computed(() => props.question.cognitiveDifficulty);
const primaryTheme = computed(() => getPrimaryTheme(props.question));
const hasOtherThemes = computed(() => hasSecondaryThemes(props.question));
const otherThemesLabel = computed(() => t("questions.themeStack.otherThemes", { count: getSecondaryThemes(props.question).length }));

const themeStackReference = useTemplateRef<InstanceType<typeof GameQuestionCardThemeStack>>("themeStackRef");

function handleOtherThemesClick(): void {
  themeStackReference.value?.toggleOpen();
}
</script>

<template>
  <header class="flex gap-3 items-center">
    <GameQuestionCardThemeStack
      ref="themeStackRef"
      :question="props.question"
    />

    <div class="min-w-0">
      <p class="flex flex-wrap gap-x-2 items-baseline leading-snug-plus">
        <span
          class="font-semibold text-(color:--game-theme-neon) text-base"
          data-testid="game-question-theme"
        >
          {{ primaryTheme?.label }}
        </span>

        <button
          v-if="hasOtherThemes"
          class="hover:underline text-(color:--game-theme-neon) text-left text-sm"
          data-testid="theme-other-themes-trigger"
          type="button"
          @click="handleOtherThemesClick"
        >
          {{ otherThemesLabel }}
        </button>
      </p>

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