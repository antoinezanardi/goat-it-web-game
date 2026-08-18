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
          class="font-semibold text-(--game-theme-neon) text-lg"
          data-testid="game-question-theme"
        >
          {{ primaryTheme?.label }}
        </span>

        <UButton
          v-if="hasOtherThemes"
          class="rounded-lg"
          color="neutral"
          data-testid="theme-other-themes-trigger"
          size="xs"
          variant="subtle"
          @click="handleOtherThemesClick"
        >
          {{ otherThemesLabel }}
        </UButton>
      </p>

      <p class="flex gap-1 items-center leading-snug-plus mt-0.5 text-sm">
        <UIcon
          class="size-4 text-(--game-theme-neon)"
          :name="getCategoryIcon(category)"
        />

        <span
          class="font-medium text-(--game-theme-neon)"
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