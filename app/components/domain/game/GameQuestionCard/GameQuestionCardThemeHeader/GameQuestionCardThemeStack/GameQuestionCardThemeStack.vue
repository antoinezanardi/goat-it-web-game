<script lang="ts" setup>
import type { GameQuestionCardThemeStackProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/game-question-card-theme-stack.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { GameQuestionCardThemeIconSize } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeIcon/game-question-card-theme-icon.types";
import { getPrimaryTheme, getSecondaryThemes } from "~/composables/domain/question/helpers/question.helpers";

const props = defineProps<GameQuestionCardThemeStackProps>();

const isPopoverOpen = ref(false);

const primaryTheme = computed(() => getPrimaryTheme(props.question));
const secondaryThemes = computed(() => getSecondaryThemes(props.question));
const themes = computed<QuestionTheme[]>(() => props.question.themes.map(assignment => assignment.theme));
const stackThemes = computed<QuestionTheme[]>(() => (primaryTheme.value === undefined ? secondaryThemes.value : [...secondaryThemes.value, primaryTheme.value]));
const isInteractive = computed<boolean>(() => props.question.themes.length > 1);

function toggleOpen(): void {
  if (!isInteractive.value) {
    return;
  }
  isPopoverOpen.value = !isPopoverOpen.value;
}

function isPrimaryTheme(theme: QuestionTheme): boolean {
  return theme.slug === primaryTheme.value?.slug;
}

function resolveIconContainerClass(theme: QuestionTheme): string {
  return isPrimaryTheme(theme) ? "z-10" : "-rotate-6 scale-85";
}

function resolveIconSize(theme: QuestionTheme): GameQuestionCardThemeIconSize {
  return isPrimaryTheme(theme) ? "md" : "sm";
}

defineExpose({
  toggleOpen,
});
</script>

<template>
  <UPopover
    v-model:open="isPopoverOpen"
    mode="click"
  >
    <button
      class="-space-x-4 cursor-pointer disabled:cursor-default flex items-center"
      data-testid="theme-stack-trigger"
      :disabled="!isInteractive"
      type="button"
    >
      <GameQuestionCardThemeIcon
        v-for="theme in stackThemes"
        :key="theme.slug"
        :class="resolveIconContainerClass(theme)"
        :data-testid="`theme-stack-icon-${theme.slug}`"
        :size="resolveIconSize(theme)"
        :theme="theme"
      />
    </button>

    <template #content>
      <GameQuestionCardThemeStackPopoverContent
        :primary-theme-slug="primaryTheme?.slug"
        :themes="themes"
      />
    </template>
  </UPopover>
</template>