<script lang="ts" setup>
import type { GameQuestionCardThemeStackPopoverContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/GameQuestionCardThemeStackPopoverContent/game-question-card-theme-stack-popover-content.types";
import { QUESTION_HINT_ICON } from "~/composables/domain/question/constants/question.constants";

const props = defineProps<GameQuestionCardThemeStackPopoverContentProps>();

const { t } = useI18n();
</script>

<template>
  <ul
    class="min-w-52 p-2"
    data-testid="theme-popover-content"
  >
    <li
      v-for="assignment in props.themes"
      :key="assignment.theme.slug"
      class="flex gap-2 items-center p-1.5"
      data-testid="theme-popover-row"
    >
      <GameQuestionCardThemeIcon
        :is-hint="assignment.isHint"
        size="sm"
        :theme="assignment.theme"
      />

      <span class="font-medium text-sm">
        {{ assignment.theme.label }}
      </span>

      <UBadge
        v-if="assignment.isPrimary"
        key="primary-badge"
        color="neutral"
        data-testid="theme-primary-badge"
        :label="t('questions.themeStack.primaryBadge')"
        size="xs"
        variant="subtle"
      />

      <UBadge
        v-if="assignment.isHint"
        key="hint-badge"
        class="border border-dashed"
        color="warning"
        data-testid="theme-hint-badge"
        :icon="QUESTION_HINT_ICON"
        :label="t('questions.themeStack.hintBadge')"
        size="xs"
        variant="subtle"
      />
    </li>
  </ul>
</template>