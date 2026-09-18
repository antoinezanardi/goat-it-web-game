<script lang="ts" setup>
import type { VTour } from "#components";

import type { TourStep } from "#nuxt-tour/props";
import type { GameTutorialEmits, GameTutorialProps } from "@/components/domain/game/GameTutorial/game-tutorial.types";
import { GAME_TUTORIAL_NAME, GAME_TUTORIAL_STEPS } from "@/components/domain/game/GameTutorial/game-tutorial.constants";

const props = defineProps<GameTutorialProps>();
const emit = defineEmits<GameTutorialEmits>();
const { t } = useI18n();

const gameTourReference = useTemplateRef<InstanceType<typeof VTour>>("gameTourRef");
const isRunning = ref<boolean>(false);

const tourSteps = computed<TourStep[]>(() => GAME_TUTORIAL_STEPS.map(step => ({
  title: t(`game.interactiveTutorial.steps.${step.key}.title`),
  body: t(`game.interactiveTutorial.steps.${step.key}.description`),
  target: step.target,
})));

const tourButtons = computed(() => ({
  back: { label: t("game.interactiveTutorial.controls.back") },
  finish: { label: t("game.interactiveTutorial.controls.finish") },
  next: { label: t("game.interactiveTutorial.controls.next") },
  skip: { label: t("game.interactiveTutorial.controls.skip") },
}));

async function start(): Promise<void> {
  isRunning.value = true;
  await gameTourReference.value?.resetTour();
}

async function end(): Promise<void> {
  if (!isRunning.value) {
    return;
  }
  isRunning.value = false;
  await gameTourReference.value?.endTour();
}

function onTourEnd(): void {
  isRunning.value = false;
  emit("end");
}

function onIsActiveChange(isActive: boolean): void {
  if (isActive) {
    void start();

    return;
  }
  void end();
}

watch(() => props.isActive, onIsActiveChange);

onBeforeUnmount(() => {
  void end();
});
</script>

<template>
  <VTour
    ref="gameTourRef"
    backdrop
    :finish-button="tourButtons.finish"
    highlight
    :name="GAME_TUTORIAL_NAME"
    :next-button="tourButtons.next"
    :prev-button="tourButtons.back"
    :skip-button="tourButtons.skip"
    :steps="tourSteps"
    @on-tour-end="onTourEnd"
  />
</template>