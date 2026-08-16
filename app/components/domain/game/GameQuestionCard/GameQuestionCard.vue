<script lang="ts" setup>
import type { GameQuestionCardProps } from "@/components/domain/game/GameQuestionCard/game-question-card.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { getPrimaryTheme } from "~/composables/domain/question/helpers/question.helpers";
import { resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardProps>();

const primaryTheme = computed<QuestionTheme | undefined>(() => getPrimaryTheme(props.question));
const themeColor = computed<string>(() => resolveThemeColor(primaryTheme.value?.color));

const hasContextSection = computed<boolean>(() => Boolean(props.question.content.context) || (props.question.content.trivia?.length ?? 0) > 0);

const wrapperStyle = computed<Record<string, string>>(() => ({
  "--game-theme-color": themeColor.value,
}));
</script>

<template>
  <article
    class="bg-card flex flex-col game-question-card game-theme-scope h-[calc(100dvh-10rem)] max-w-3xl md:max-h-[650px] md:p-6 mx-auto overflow-clip p-4 relative rounded-xl z-0"
    data-testid="game-question"
    :style="wrapperStyle"
  >
    <div
      aria-hidden="true"
      class="game-card-halo"
    />

    <div
      class="flex-1 min-h-0 overflow-y-auto"
      data-testid="game-question-body"
    >
      <GameQuestionCardThemeHeader
        v-if="primaryTheme"
        :category="props.question.category"
        :difficulty="props.question.cognitiveDifficulty"
        :theme="primaryTheme"
      />

      <GameQuestionCardStatement
        class="mt-4"
        :text="props.question.content.statement"
      />

      <GameQuestionCardThemeSeparator class="my-3"/>

      <GameQuestionCardAnswer
        :text="props.question.content.answer"
      />

      <GameQuestionCardContextAccordion
        v-if="hasContextSection"
        :key="props.question.id"
        class="mt-4"
        :context="props.question.content.context"
        :trivia="props.question.content.trivia"
      />
    </div>

    <GameQuestionCardSourceList
      class="pt-4 shrink-0"
      :source-urls="props.question.sourceUrls"
    />
  </article>
</template>

<style scoped>
.game-card-halo {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 0.75rem;
  filter: blur(28px);
  pointer-events: none;
  background:
    radial-gradient(
      100dvw circle at 15% 20%,
      color-mix(in srgb, var(--game-theme-neon) 20%, transparent) 0%,
      color-mix(in srgb, var(--game-theme-neon) 5%, transparent) 40%,
      transparent 60%
    ),
    radial-gradient(
      100dvw circle at 85% 80%,
      color-mix(in srgb, var(--game-theme-neon) 13%, transparent) 0%,
      color-mix(in srgb, var(--game-theme-neon) 4%, transparent) 40%,
      transparent 60%
    );
  animation: glow-breathe 25s ease-in-out infinite;
}

.game-card-halo::before {
  content: "";
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(
      360px circle at 50% 50%,
      color-mix(in srgb, var(--game-theme-neon) 28%, transparent) 0%,
      color-mix(in srgb, var(--game-theme-neon) 14%, transparent) 30%,
      color-mix(in srgb, var(--game-theme-neon) 4%, transparent) 50%,
      transparent 65%
    );
  animation: wander-a 18s linear infinite;
}

.game-card-halo::after {
  content: "";
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(
      380px circle at 50% 50%,
      color-mix(in srgb, var(--game-theme-neon) 20%, transparent) 0%,
      color-mix(in srgb, var(--game-theme-neon) 10%, transparent) 25%,
      color-mix(in srgb, var(--game-theme-neon) 3%, transparent) 45%,
      transparent 60%
    );
  animation: wander-b 14s linear infinite reverse;
}

.game-question-card {
  border: 1px solid var(--game-theme-border);
  box-shadow:
    0 0 12px 3px var(--game-theme-halo-near),
    0 0 36px 8px var(--game-theme-halo-far),
    0 0 60px 16px var(--game-theme-glow-soft);
}

@media (prefers-reduced-motion: reduce) {
  .game-card-halo,
  .game-card-halo::before,
  .game-card-halo::after {
    animation: none;
  }
}

@keyframes glow-breathe {
  0%, 100% { transform: scale(1.05) translate(0, 0); opacity: 0.45; }
  25% { transform: scale(1.12) translate(6px, -4px); opacity: 0.6; }
  50% { transform: scale(0.95) translate(-4px, 5px); opacity: 0.35; }
  75% { transform: scale(1.08) translate(-5px, -3px); opacity: 0.6; }
}

@keyframes wander-a {
  from { transform: rotate(360deg) translate(150px, 0); }
  to { transform: rotate(0deg) translate(150px, 0); }
}

@keyframes wander-b {
  from { transform: rotate(0deg) translate(140px, 0); }
  to { transform: rotate(360deg) translate(140px, 0); }
}
</style>