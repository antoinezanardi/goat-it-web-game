<script lang="ts" setup>
import type { GameQuestionCardThemeStackProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/game-question-card-theme-stack.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { getPrimaryTheme, getSecondaryThemes } from "~/composables/domain/question/helpers/question.helpers";
import { getThemeIcon, resolveThemeColor } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

const props = defineProps<GameQuestionCardThemeStackProps>();

const open = ref(false);
const { t } = useI18n();

const primaryTheme = computed(() => getPrimaryTheme(props.question));
const secondaryThemes = computed(() => getSecondaryThemes(props.question));
const stackThemes = computed<QuestionTheme[]>(() => [...secondaryThemes.value, primaryTheme.value].filter((theme): theme is QuestionTheme => theme !== undefined));
const allThemes = computed<QuestionTheme[]>(() => [primaryTheme.value, ...secondaryThemes.value].filter((theme): theme is QuestionTheme => theme !== undefined));

const otherThemesLabel = computed(() => t("questions.themeStack.otherThemes", { count: secondaryThemes.value.length }));

function toggleOpen(): void {
  open.value = !open.value;
}

defineExpose({
  get otherThemesLabel(): string {
    return otherThemesLabel.value;
  },
  toggleOpen,
});
</script>

<template>
  <UPopover
    v-model:open="open"
    mode="click"
  >
    <div
      class="-space-x-3 cursor-pointer flex items-center"
      data-testid="theme-stack-trigger"
      role="button"
      tabindex="0"
      @keydown.enter.prevent="toggleOpen"
    >
      <span
        v-for="theme in stackThemes"
        :key="theme.slug"
        class="bg-content border inline-flex items-center justify-center relative rounded-lg shrink-0 size-10"
        :class="{ 'z-10 border-(color:--game-theme-border) shadow-[0_0_8px_var(--game-theme-glow-soft)]': theme.slug === primaryTheme?.slug }"
        :data-testid="`theme-stack-icon-${theme.slug}`"
        :style="theme.slug === primaryTheme?.slug ? undefined : {
          'borderColor': resolveThemeColor(theme.color),
          'boxShadow': `0 0 8px color-mix(in srgb, ${resolveThemeColor(theme.color)} 40%, transparent)`
        }"
      >
        <UIcon
          class="size-8"
          :class="{ 'text-(color:--game-theme-neon)': theme.slug === primaryTheme?.slug }"
          :name="getThemeIcon(theme.slug)"
          :style="theme.slug === primaryTheme?.slug ? undefined : { 'color': resolveThemeColor(theme.color) }"
        />
      </span>
    </div>

    <template #content>
      <ul
        class="min-w-52 p-2"
        data-testid="theme-popover-content"
      >
        <li
          v-for="theme in allThemes"
          :key="theme.slug"
          class="flex gap-2 items-center p-1.5"
          data-testid="theme-popover-row"
        >
          <span
            class="bg-content border inline-flex items-center justify-center rounded-lg shrink-0 size-8"
            :style="{
              'borderColor': resolveThemeColor(theme.color),
              'boxShadow': `0 0 6px color-mix(in srgb, ${resolveThemeColor(theme.color)} 35%, transparent)`
            }"
          >
            <UIcon
              class="size-6"
              :name="getThemeIcon(theme.slug)"
              :style="{ 'color': resolveThemeColor(theme.color) }"
            />
          </span>

          <span class="font-medium text-sm">
            {{ theme.label }}
          </span>

          <UBadge
            v-if="theme.slug === primaryTheme?.slug"
            color="neutral"
            data-testid="theme-primary-badge"
            :label="t('questions.themeStack.primaryBadge')"
            size="xs"
            variant="subtle"
          />
        </li>
      </ul>
    </template>
  </UPopover>
</template>