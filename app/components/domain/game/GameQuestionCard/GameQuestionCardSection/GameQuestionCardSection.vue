<script lang="ts" setup>
import type {
  GameQuestionCardSectionProps,
  GameQuestionCardSectionSlots,
} from "@/components/domain/game/GameQuestionCard/GameQuestionCardSection/game-question-card-section.types";

const props = defineProps<GameQuestionCardSectionProps>();

defineSlots<GameQuestionCardSectionSlots>();
</script>

<template>
  <section class="bg-content border border-(color:--game-theme-border) md:p-5 p-4 rounded-lg">
    <p class="flex font-semibold gap-1.5 items-center mb-2 text-(color:--game-theme-neon) text-base">
      <UIcon
        class="size-5"
        :name="props.icon"
      />
      {{ props.label }}
    </p>

    <p
      class="font-medium leading-normal md:text-xl text-fg-primary text-lg"
      :data-testid="props.dataTestid"
    >
      <slot/>
    </p>
  </section>
</template>