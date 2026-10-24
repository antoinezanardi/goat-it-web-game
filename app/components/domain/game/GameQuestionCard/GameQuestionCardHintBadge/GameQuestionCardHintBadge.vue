<script lang="ts" setup>
import { UBadge } from "#components";

import type { GameQuestionCardHintBadgeExposed } from "@/components/domain/game/GameQuestionCard/GameQuestionCardHintBadge/game-question-card-hint-badge.types";
import { QUESTION_HINT_ICON } from "@/utils/ui/question/question.constants";
import { resolveHTMLElement } from "@/utils/core/element/element.dom.helpers";

const { t } = useI18n();

const highlight = useQuestionCardHighlight();
const badgeElementReference = useTemplateRef<InstanceType<typeof UBadge>>("badgeElementReference");

async function playHighlight(): Promise<void> {
  const badgeElement = resolveHTMLElement(badgeElementReference.value);
  if (badgeElement === undefined) {
    return;
  }
  await highlight.animate([badgeElement]);
}

const exposed: GameQuestionCardHintBadgeExposed = {
  playHighlight,
};

defineExpose(exposed);
</script>

<template>
  <UPopover
    enable-touch
    mode="hover"
    portal="main"
  >
    <UBadge
      ref="badgeElementReference"
      :aria-label="t('questions.themeStack.primaryThemeHintTooltip')"
      class="border-2 border-dashed border-warning my-0.5 p-1 rounded-full"
      color="warning"
      data-testid="game-question-hint"
      :icon="QUESTION_HINT_ICON"
      role="img"
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