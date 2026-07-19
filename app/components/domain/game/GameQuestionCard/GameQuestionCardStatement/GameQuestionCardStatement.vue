<script lang="ts" setup>
import type { GameQuestionCardStatementProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardStatement/game-question-card-statement.types";

const props = defineProps<GameQuestionCardStatementProps>();
const { t } = useI18n();
</script>

<template>
  <section class="bg-content border border-border-subtle md:p-5 p-4 rounded-lg">
    <p
      class="flex font-semibold gap-1.5 items-center mb-2 text-(color:--game-theme-neon) text-xs"
    >
      <UIcon
        class="size-4"
        name="i-lucide-help-circle"
      />
      {{ t("questions.questionLabel") }}
    </p>

    <p
      class="font-medium leading-[1.5] md:text-xl text-lg text-text-primary"
      data-testid="game-question-statement"
    >
      {{ props.text }}
    </p>
  </section>
</template>