<script lang="ts" setup>
import { QUESTION_HINT_ICON } from "~/composables/domain/question/constants/question.constants";

const { t } = useI18n();
</script>

<template>
  <UPopover
    enable-touch
    mode="hover"
  >
    <UBadge
      :aria-label="t('questions.themeStack.primaryThemeHintTooltip')"
      class="border-2 border-dashed border-warning my-0.5 p-1 rounded-full"
      color="warning"
      data-testid="game-question-hint"
      :icon="QUESTION_HINT_ICON"
      size="md"
      square
      variant="subtle"
    />

    <template #content>
      <div
        class="px-3 py-2 text-sm"
        data-testid="game-question-hint-popover"
      >
        {{ t("questions.themeStack.primaryThemeHintTooltip") }}
      </div>
    </template>
  </UPopover>
</template>