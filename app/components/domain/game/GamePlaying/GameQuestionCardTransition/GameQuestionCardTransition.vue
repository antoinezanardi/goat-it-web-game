<script lang="ts" setup>
import { GameQuestionCard } from "#components";

import { CARD_TRANSITION_DURATION_SECONDS, CARD_TRANSITION_ROTATION_DEGREES, CARD_TRANSITION_SLIDE_PERCENT } from "@/components/domain/game/GamePlaying/GameQuestionCardTransition/game-question-card-transition.constants";
import type { GameQuestionCardTransitionDirection, GameQuestionCardTransitionEmits, GameQuestionCardTransitionProps } from "@/components/domain/game/GamePlaying/GameQuestionCardTransition/game-question-card-transition.types";

const props = defineProps<GameQuestionCardTransitionProps>();
const emit = defineEmits<GameQuestionCardTransitionEmits>();

const gsap = useGSAP();

const leavingCardReference = useTemplateRef<InstanceType<typeof GameQuestionCard>>("leavingCardReference");
const enteringCardReference = useTemplateRef<InstanceType<typeof GameQuestionCard>>("enteringCardReference");

const gsapContext = shallowRef<{ revert: () => void }>();

function animateCardTransition(
  leavingElement: HTMLElement,
  enteringElement: HTMLElement,
  direction: GameQuestionCardTransitionDirection,
): void {
  const isForward = direction === "forward";
  const leaveXPercent = isForward ? -CARD_TRANSITION_SLIDE_PERCENT : CARD_TRANSITION_SLIDE_PERCENT;
  const enterFromXPercent = isForward ? CARD_TRANSITION_SLIDE_PERCENT : -CARD_TRANSITION_SLIDE_PERCENT;
  const leaveRotation = isForward ? -CARD_TRANSITION_ROTATION_DEGREES : CARD_TRANSITION_ROTATION_DEGREES;
  const enterFromRotation = isForward ? CARD_TRANSITION_ROTATION_DEGREES : -CARD_TRANSITION_ROTATION_DEGREES;

  const isReducedMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = isReducedMotion ? 0 : CARD_TRANSITION_DURATION_SECONDS;

  gsap.set(enteringElement, { xPercent: enterFromXPercent, rotation: enterFromRotation, opacity: 0 });

  gsap.timeline({
    onComplete: () => {
      emit("complete");
    },
  }).to(leavingElement, { xPercent: leaveXPercent, rotation: leaveRotation, opacity: 0, duration, ease: "expo.out" }, 0)
    .to(enteringElement, { xPercent: 0, rotation: 0, opacity: 1, duration, ease: "expo.out" }, 0);
}

onMounted(() => {
  gsapContext.value = gsap.context(() => {
    const leavingElement = leavingCardReference.value?.$el;
    const enteringElement = enteringCardReference.value?.$el;

    if (leavingElement instanceof HTMLElement && enteringElement instanceof HTMLElement) {
      animateCardTransition(leavingElement, enteringElement, props.direction);
    }
  });
});

onUnmounted(() => {
  gsapContext.value?.revert();
});
</script>

<template>
  <div class="game-question-card-transition-wrapper relative">
    <div
      class="absolute left-0 top-0 w-full"
      data-testid="card-transition-leaving"
    >
      <GameQuestionCard
        ref="leavingCardReference"
        :question="props.leavingQuestion"
      />
    </div>

    <div
      class="w-full z-10"
      data-testid="card-transition-entering"
    >
      <GameQuestionCard
        ref="enteringCardReference"
        :question="props.enteringQuestion"
      />
    </div>
  </div>
</template>