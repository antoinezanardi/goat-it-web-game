<script lang="ts" setup>
import type { GameQuestionCardContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardContent/game-question-card-content.types";

const props = defineProps<GameQuestionCardContentProps>();

const labelColorClass = "text-(color:--game-theme-neon)";

const textColorClass = computed(() => (props.variant === "answer" ? "text-text-answer" : "text-text-primary"));
</script>

<template>
  <section class="bg-content border border-border-subtle md:p-5 p-4 rounded-lg">
    <p
      class="flex font-semibold gap-1.5 items-center mb-2 text-xs"
      :class="labelColorClass"
    >
      <UIcon
        class="size-4"
        :name="icon"
      />
      {{ label }}
    </p>

    <p
      class="font-medium leading-[1.5] md:text-xl text-lg"
      :class="textColorClass"
      :data-testid="textTestId"
    >
      {{ text }}
    </p>
  </section>
</template>