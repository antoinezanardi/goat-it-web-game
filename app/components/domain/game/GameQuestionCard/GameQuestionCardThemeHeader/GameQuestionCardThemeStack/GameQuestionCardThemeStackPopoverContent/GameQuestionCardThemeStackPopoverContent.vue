<script lang="ts" setup>
import type { GameQuestionCardThemeStackPopoverContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/GameQuestionCardThemeStackPopoverContent/game-question-card-theme-stack-popover-content.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardThemeStackPopoverContentProps>();

const { t } = useI18n();

function resolveRowIconContainerStyle(theme: QuestionTheme): Record<string, string> {
  const color = resolveThemeColor(theme.color);

  return {
    borderColor: color,
    boxShadow: `0 0 6px color-mix(in srgb, ${color} 35%, transparent)`,
  };
}

function resolveRowIconStyle(theme: QuestionTheme): Record<string, string> {
  return { color: resolveThemeColor(theme.color) };
}
</script>

<template>
  <ul
    class="min-w-52 p-2"
    data-testid="theme-popover-content"
  >
    <li
      v-for="theme in props.themes"
      :key="theme.slug"
      class="flex gap-2 items-center p-1.5"
      data-testid="theme-popover-row"
    >
      <span
        class="bg-content border inline-flex items-center justify-center rounded-lg shrink-0 size-8"
        :style="resolveRowIconContainerStyle(theme)"
      >
        <UIcon
          class="size-6"
          :name="getThemeIcon(theme.slug)"
          :style="resolveRowIconStyle(theme)"
        />
      </span>

      <span class="font-medium text-sm">
        {{ theme.label }}
      </span>

      <UBadge
        v-if="theme.slug === props.primaryThemeSlug"
        color="neutral"
        data-testid="theme-primary-badge"
        :label="t('questions.themeStack.primaryBadge')"
        size="xs"
        variant="subtle"
      />
    </li>
  </ul>
</template>