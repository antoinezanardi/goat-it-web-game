<script lang="ts" setup>
import type { GameQuestionCardThemeStackPopoverContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/GameQuestionCardThemeStackPopoverContent/game-question-card-theme-stack-popover-content.types";
import { QUESTION_HINT_ICON, QUESTION_PRIMARY_ICON } from "~/composables/domain/question/constants/question.constants";

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
      class="flex gap-2 items-start p-1.5"
      data-testid="theme-popover-row"
    >
      <GameQuestionCardThemeIcon
        :is-hint="assignment.isHint"
        size="sm"
        :theme="assignment.theme"
      />

      <div class="min-w-0">
        <span class="font-medium text-sm">
          {{ assignment.theme.label }}
        </span>

        <div
          v-if="assignment.isPrimary || assignment.isHint"
          class="flex flex-wrap gap-1 mt-1"
        >
          <UBadge
            v-if="assignment.isPrimary"
            key="primary-badge"
            color="primary"
            data-testid="theme-primary-badge"
            :icon="QUESTION_PRIMARY_ICON"
            :label="t('questions.themeStack.primaryBadge')"
            size="xs"
            variant="subtle"
          />

          <UPopover
            v-if="assignment.isHint"
            enable-touch
            mode="hover"
          >
            <UBadge
              key="hint-badge"
              class="border border-dashed"
              color="warning"
              data-testid="theme-hint-badge"
              :icon="QUESTION_HINT_ICON"
              :label="t('questions.themeStack.hintBadge')"
              size="xs"
              variant="subtle"
            />

            <template #content>
              <div
                class="px-3 py-2 text-sm"
                data-testid="theme-hint-popover"
              >
                {{ t("questions.themeStack.hintTooltip") }}
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </li>
  </ul>
</template>