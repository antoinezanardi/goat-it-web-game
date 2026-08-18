<script lang="ts" setup>
import type { GameQuestionCardThemeStackPopoverContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/GameQuestionCardThemeStackPopoverContent/game-question-card-theme-stack-popover-content.types";

const props = defineProps<GameQuestionCardThemeStackPopoverContentProps>();

const { t } = useI18n();

function isPrimaryTheme(slug: string): boolean {
  return slug === props.primaryThemeSlug;
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
      <GameQuestionCardThemeIcon
        size="sm"
        :theme="theme"
      />

      <span class="font-medium text-sm">
        {{ theme.label }}
      </span>

      <UBadge
        v-if="isPrimaryTheme(theme.slug)"
        color="neutral"
        data-testid="theme-primary-badge"
        :label="t('questions.themeStack.primaryBadge')"
        size="xs"
        variant="subtle"
      />
    </li>
  </ul>
</template>