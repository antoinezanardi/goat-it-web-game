<script lang="ts" setup>
import { GameQuestionCard } from "#components";

import type { Question } from "#shared/types/question.types";
import { CARD_TRANSITION_DURATION_SECONDS, CARD_TRANSITION_ROTATION_DEGREES, CARD_TRANSITION_SLIDE_PERCENT } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.constants";
import type { GameQuestionCardSwitcherDirection, GameQuestionCardSwitcherEmits, GameQuestionCardSwitcherProps } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";
import type { GsapContext } from "@/composables/core/gsap/gsap.types";

const props = defineProps<GameQuestionCardSwitcherProps>();
const emit = defineEmits<GameQuestionCardSwitcherEmits>();

const gsap = useGSAP();

const leavingCardReference = useTemplateRef<InstanceType<typeof GameQuestionCard>>("leavingCardReference");
const enteringCardReference = useTemplateRef<InstanceType<typeof GameQuestionCard>>("enteringCardReference");

const leavingCardQuestion = computed(() => props.leavingQuestion ?? props.question);
const enteringCardQuestion = computed(() => props.enteringQuestion ?? props.question);

const gsapContext = shallowRef<GsapContext>();

function animateCardTransition(
  leavingElement: HTMLElement,
  enteringElement: HTMLElement,
  direction: GameQuestionCardSwitcherDirection,
): void {
  const isForward = direction === "forward";
  const leaveXPercent = isForward ? -CARD_TRANSITION_SLIDE_PERCENT : CARD_TRANSITION_SLIDE_PERCENT;
  const enterFromXPercent = isForward ? CARD_TRANSITION_SLIDE_PERCENT : -CARD_TRANSITION_SLIDE_PERCENT;
  const leaveRotation = isForward ? -CARD_TRANSITION_ROTATION_DEGREES : CARD_TRANSITION_ROTATION_DEGREES;
  const enterFromRotation = isForward ? CARD_TRANSITION_ROTATION_DEGREES : -CARD_TRANSITION_ROTATION_DEGREES;

  const isReducedMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = isReducedMotion ? 0 : CARD_TRANSITION_DURATION_SECONDS;

  gsap.set(leavingElement, { autoAlpha: 1, xPercent: 0, rotation: 0 });
  gsap.set(enteringElement, { autoAlpha: 0, xPercent: enterFromXPercent, rotation: enterFromRotation });

  gsap.timeline({
    onComplete: () => {
      emit("complete");
    },
  }).to(leavingElement, { autoAlpha: 0, xPercent: leaveXPercent, rotation: leaveRotation, duration, ease: "expo.out" }, 0)
    .to(enteringElement, { autoAlpha: 1, xPercent: 0, rotation: 0, duration, ease: "expo.out" }, 0);
}

onMounted(() => {
  gsapContext.value = gsap.context(() => {
    const leavingElement = leavingCardReference.value?.$el;

    if (leavingElement instanceof HTMLElement) {
      gsap.set(leavingElement, { autoAlpha: 0 });
    }
  });
});

function handleQuestionChange([leavingQuestion, enteringQuestion]: readonly [Question | undefined, Question | undefined]): void {
  if (!leavingQuestion || !enteringQuestion) {
    return;
  }

  const leavingElement = leavingCardReference.value?.$el;
  const enteringElement = enteringCardReference.value?.$el;

  if (leavingElement instanceof HTMLElement && enteringElement instanceof HTMLElement) {
    gsapContext.value?.add(() => animateCardTransition(leavingElement, enteringElement, props.direction));
  }
}

watch(
  () => [props.leavingQuestion, props.enteringQuestion] as const,
  handleQuestionChange,
  { flush: "post" },
);

onUnmounted(() => {
  gsapContext.value?.revert();
});
</script>

<template>
  <div class="game-question-card-switcher-wrapper relative">
    <div
      class="absolute left-0 top-0 w-full"
      data-testid="card-transition-leaving"
    >
      <GameQuestionCard
        ref="leavingCardReference"
        :question="leavingCardQuestion"
      />
    </div>

    <div
      class="relative w-full z-10"
      data-testid="card-transition-entering"
    >
      <GameQuestionCard
        ref="enteringCardReference"
        :question="enteringCardQuestion"
      />
    </div>
  </div>
</template>