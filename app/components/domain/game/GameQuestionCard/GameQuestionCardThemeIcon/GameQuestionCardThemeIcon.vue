<script lang="ts" setup>
import type { GameQuestionCardThemeIconProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeIcon/game-question-card-theme-icon.types";
import { getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = withDefaults(defineProps<GameQuestionCardThemeIconProps>(), {
  size: "md",
});

const iconName = computed(() => getThemeIcon(props.theme.slug));
const resolvedColor = computed(() => resolveThemeColor(props.theme.color));
const iconClass = computed(() => (props.size === "sm" ? "size-7" : "size-8"));
const neonColor = computed(() => `oklch(from ${resolvedColor.value} max(l, 0.85) c h)`);
const borderStyle = computed(() => `color-mix(in oklch, ${neonColor.value} 55%, transparent)`);
const glowStyle = computed(() => `0 0 8px color-mix(in oklch, ${neonColor.value} 15%, transparent)`);
</script>

<template>
  <span
    class="bg-content border inline-flex items-center justify-center p-1 relative rounded-lg shrink-0"
    :style="{ 'borderColor': borderStyle, 'boxShadow': glowStyle }"
  >
    <UIcon
      :class="iconClass"
      :name="iconName"
      :style="{ 'color': neonColor }"
    />
  </span>
</template>