<script lang="ts" setup>
import { nextTick, watch } from "vue";

import { GameQuestionCardHintBadge, GameQuestionCardThemeStack } from "#components";

import { QUESTION_CARD_HIGHLIGHT_SEQUENCE_GAP_MS } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.constants";
import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";
import { getCategoryIcon, getPrimaryTheme, getSecondaryThemes, hasSecondaryThemes, isPrimaryThemeHint } from "~/composables/domain/question/helpers/question.helpers";

const props = withDefaults(defineProps<GameQuestionCardThemeHeaderProps>(), {
  isActive: true,
});

const { t } = useI18n();
const highlight = useQuestionCardHighlight();

const category = computed(() => props.question.category);
const isPrimaryHint = computed(() => isPrimaryThemeHint(props.question));
const difficulty = computed(() => props.question.cognitiveDifficulty);
const primaryTheme = computed(() => getPrimaryTheme(props.question));
const hasOtherThemes = computed(() => hasSecondaryThemes(props.question));
const otherThemesLabel = computed(() => t("questions.themeStack.otherThemes", { count: getSecondaryThemes(props.question).length }));

const themeStackReference = useTemplateRef<InstanceType<typeof GameQuestionCardThemeStack>>("themeStackRef");
const hintBadgeReference = useTemplateRef<InstanceType<typeof GameQuestionCardHintBadge>>("hintBadgeRef");

function handleOtherThemesClick(): void {
  themeStackReference.value?.toggleOpen();
}

async function playActiveHighlightSequence(): Promise<void> {
  await nextTick();
  await highlight.playSequence(
    [hasOtherThemes.value ? themeStackReference.value : undefined, hintBadgeReference.value],
    { gapMs: QUESTION_CARD_HIGHLIGHT_SEQUENCE_GAP_MS },
  );
}

watch(
  () => props.isActive,
  async active => {
    if (!active) {
      return;
    }
    await playActiveHighlightSequence();
  },
  { immediate: true },
);
</script>

<template>
  <header class="flex gap-3 items-center">
    <GameQuestionCardThemeStack
      ref="themeStackRef"
      :question="props.question"
    />

    <div class="min-w-0">
      <div class="flex flex-wrap gap-x-1.5">
        <p class="flex gap-x-1.5 items-center leading-snug-plus">
          <GameQuestionCardHintBadge
            v-if="isPrimaryHint"
            ref="hintBadgeRef"
            class="-ml-1"
          />

          <span
            class="font-semibold md:text-lg text-(--game-theme-neon) text-base"
            data-testid="game-question-theme"
          >
            {{ primaryTheme?.label }}
          </span>
        </p>

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
      </div>

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

    <div class="flex flex-col gap-2 items-center ml-auto">
      <GameQuestionCardDifficultyBadge :difficulty="difficulty"/>
    </div>
  </header>
</template>