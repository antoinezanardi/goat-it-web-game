<script lang="ts" setup>
import type { GameTutorialEmits, GameTutorialProps } from "@/components/domain/game/GameTutorial/game-tutorial.types";
import { GAME_TUTORIAL_HIGHLIGHT_CLASS, GAME_TUTORIAL_STEPS } from "@/components/domain/game/GameTutorial/game-tutorial.constants";

const props = defineProps<GameTutorialProps>();
const emit = defineEmits<GameTutorialEmits>();
const { t } = useI18n();

const GAME_TUTORIAL_POPOVER_UI = { content: "z-50" };
const GAME_TUTORIAL_POPOVER_MARGIN = 16;
const GAME_TUTORIAL_POPOVER_MIN_HEIGHT = 160;
const GAME_TUTORIAL_POPOVER_OFFSET = 12;

const popoverMaxHeight = ref<string>("none");
const popoverSide = ref<"bottom" | "top">("bottom");
const popoverContent = computed(() => ({
  side: popoverSide.value,
  sideOffset: GAME_TUTORIAL_POPOVER_OFFSET,
}));

const tourSteps = computed(() => GAME_TUTORIAL_STEPS.map(step => ({
  description: t(`game.interactiveTutorial.steps.${step.key}.description`),
  target: step.target === undefined ? undefined : (): Element | null => document.querySelector(step.target),
  title: t(`game.interactiveTutorial.steps.${step.key}.title`),
})));

const {
  current,
  finish,
  hasNext,
  hasPrev,
  index,
  open,
  next,
  prev,
  reference,
  start,
} = useTour(tourSteps);

const highlightedElement = shallowRef<Element>();

function clearHighlight(): void {
  highlightedElement.value?.classList.remove(GAME_TUTORIAL_HIGHLIGHT_CLASS);
  highlightedElement.value = undefined;
}

function updateTourLayout(element?: Element): void {
  if (element === undefined) {
    popoverMaxHeight.value = "none";
    popoverSide.value = "bottom";

    return;
  }
  const { bottom, top } = element.getBoundingClientRect();
  const spaceAbove = top - GAME_TUTORIAL_POPOVER_MARGIN;
  const spaceBelow = window.innerHeight - bottom - GAME_TUTORIAL_POPOVER_MARGIN;
  const shouldOpenAbove = spaceAbove > spaceBelow;

  popoverSide.value = shouldOpenAbove ? "top" : "bottom";
  popoverMaxHeight.value = `${Math.max(shouldOpenAbove ? spaceAbove : spaceBelow, GAME_TUTORIAL_POPOVER_MIN_HEIGHT)}px`;
}

function updateTourTarget(): void {
  clearHighlight();

  if (reference.value instanceof Element) {
    highlightedElement.value = reference.value;
    highlightedElement.value.classList.add(GAME_TUTORIAL_HIGHLIGHT_CLASS);
    updateTourLayout(reference.value);

    return;
  }
  updateTourLayout();
}

watch(() => props.isActive, isActive => {
  if (isActive) {
    start(0);

    return;
  }
  finish();
});

watch([open, index], updateTourTarget);

watch(open, isOpen => {
  if (!isOpen) {
    emit("end");
  }
});

onBeforeUnmount(() => {
  clearHighlight();
});
</script>

<template>
  <div>
    <div
      v-if="open"
      class="bg-black/60 fixed inset-0 z-40"
      data-testid="game-tutorial-backdrop"
    />

    <UPopover
      :content="popoverContent"
      :dismissible="false"
      :open="open"
      :reference="reference"
      :ui="GAME_TUTORIAL_POPOVER_UI"
    >
      <template #content>
        <div
          class="flex flex-col gap-4 max-w-sm overflow-y-auto"
          data-testid="game-tutorial"
          :style="{ 'maxHeight': popoverMaxHeight }"
        >
          <div class="flex flex-col gap-1">
            <h2
              class="font-semibold text-fg-primary"
              data-testid="game-tutorial-title"
            >
              {{ current?.title }}
            </h2>

            <p
              class="text-muted text-sm"
              data-testid="game-tutorial-description"
            >
              {{ current?.description }}
            </p>
          </div>

          <div class="flex gap-2 justify-end">
            <UButton
              v-if="hasPrev"
              color="neutral"
              data-testid="game-tutorial-back"
              variant="soft"
              @click="prev"
            >
              {{ t("game.interactiveTutorial.controls.back") }}
            </UButton>

            <UButton
              color="neutral"
              data-testid="game-tutorial-skip"
              variant="ghost"
              @click="finish"
            >
              {{ t("game.interactiveTutorial.controls.skip") }}
            </UButton>

            <UButton
              v-if="hasNext"
              key="u-button-2"
              data-testid="game-tutorial-next"
              @click="next"
            >
              {{ t("game.interactiveTutorial.controls.next") }}
            </UButton>

            <UButton
              v-else
              key="u-button-3"
              data-testid="game-tutorial-finish"
              @click="finish"
            >
              {{ t("game.interactiveTutorial.controls.finish") }}
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>