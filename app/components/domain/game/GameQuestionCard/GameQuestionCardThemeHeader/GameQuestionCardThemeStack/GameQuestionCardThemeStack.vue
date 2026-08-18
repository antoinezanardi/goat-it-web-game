<script lang="ts" setup>
import type { GameQuestionCardThemeStackProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/game-question-card-theme-stack.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { getPrimaryTheme, getSecondaryThemes } from "~/composables/domain/question/helpers/question.helpers";
import { getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardThemeStackProps>();

const open = ref(false);

const primaryTheme = computed(() => getPrimaryTheme(props.question));
const secondaryThemes = computed(() => getSecondaryThemes(props.question));
const themes = computed<QuestionTheme[]>(() => props.question.themes.map(assignment => assignment.theme));
const stackThemes = computed<QuestionTheme[]>(() => (primaryTheme.value === undefined ? secondaryThemes.value : [...secondaryThemes.value, primaryTheme.value]));
const isInteractive = computed<boolean>(() => props.question.themes.length > 1);

function toggleOpen(): void {
  if (!isInteractive.value) {
    return;
  }
  open.value = !open.value;
}

function isPrimaryTheme(theme: QuestionTheme): boolean {
  return theme.slug === primaryTheme.value?.slug;
}

function resolveIconContainerClass(theme: QuestionTheme): string {
  return isPrimaryTheme(theme) ? "z-10 border-(color:--game-theme-border) shadow-[0_0_8px_var(--game-theme-glow-soft)]" : "-rotate-6 scale-90";
}

function resolveIconContainerStyle(theme: QuestionTheme): Record<string, string> | undefined {
  if (isPrimaryTheme(theme)) {
    return undefined;
  }
  const color = resolveThemeColor(theme.color);

  return {
    borderColor: color,
    boxShadow: `0 0 8px color-mix(in srgb, ${color} 40%, transparent)`,
  };
}

function resolveIconClass(theme: QuestionTheme): string {
  return isPrimaryTheme(theme) ? "text-(color:--game-theme-neon)" : "";
}

function resolveIconStyle(theme: QuestionTheme): Record<string, string> | undefined {
  return isPrimaryTheme(theme) ? undefined : { color: resolveThemeColor(theme.color) };
}

defineExpose({
  toggleOpen,
});
</script>

<template>
  <UPopover
    v-model:open="open"
    mode="click"
  >
    <button
      class="-space-x-3 cursor-pointer disabled:cursor-not-allowed flex items-center"
      data-testid="theme-stack-trigger"
      :disabled="!isInteractive"
      type="button"
      @keydown.enter.prevent="toggleOpen"
    >
      <span
        v-for="theme in stackThemes"
        :key="theme.slug"
        class="bg-content border inline-flex items-center justify-center relative rounded-lg shrink-0 size-10"
        :class="resolveIconContainerClass(theme)"
        :data-testid="`theme-stack-icon-${theme.slug}`"
        :style="resolveIconContainerStyle(theme)"
      >
        <UIcon
          class="size-8"
          :class="resolveIconClass(theme)"
          :name="getThemeIcon(theme.slug)"
          :style="resolveIconStyle(theme)"
        />
      </span>
    </button>

    <template #content>
      <GameQuestionCardThemeStackPopoverContent
        :primary-theme-slug="primaryTheme?.slug"
        :themes="themes"
      />
    </template>
  </UPopover>
</template>