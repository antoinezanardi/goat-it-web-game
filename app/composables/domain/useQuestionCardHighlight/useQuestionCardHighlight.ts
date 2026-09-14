import { usePreferredReducedMotion } from "@vueuse/core";

import {
  QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
  QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES,
  QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
} from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.constants";
import type { UseQuestionCardHighlightReturn } from "~/composables/domain/useQuestionCardHighlight/use-question-card-highlight.types";

function useQuestionCardHighlight(): UseQuestionCardHighlightReturn {
  const gsap = useGSAP();
  const reducedMotion = usePreferredReducedMotion();

  async function animate(elements: HTMLElement[]): Promise<void> {
    if (reducedMotion.value === "reduce") {
      return;
    }
    return new Promise(resolve => {
      gsap.timeline({ onComplete: resolve }).to(
        elements,
        {
          duration: QUESTION_CARD_HIGHLIGHT_DURATION_SECONDS,
          keyframes: [...QUESTION_CARD_HIGHLIGHT_SCALE_BRIGHTNESS_KEYFRAMES],
          stagger: QUESTION_CARD_HIGHLIGHT_STAGGER_SECONDS,
        },
        0,
      );
    });
  }

  // Acceptable as playSequence is intentionally scoped inside the composable for consistency with sibling composables
  // oxlint-disable-next-line unicorn/consistent-function-scoping
  async function playSequence(
    targets: ({ playHighlight: () => Promise<void> } | undefined | null)[],
    options: { gapMs?: number } = {},
  ): Promise<void> {
    const { gapMs = 0 } = options;
    const playableTargets = targets.filter((target): target is { playHighlight: () => Promise<void> } => target !== undefined && target !== null);

    for (const [index, target] of playableTargets.entries()) {
      // Acceptable as sequential await is intentional — playSequence must run targets one after another
      // oxlint-disable-next-line eslint/no-await-in-loop
      await target.playHighlight();

      if (index < playableTargets.length - 1) {
        // Acceptable as the gap delay must resolve sequentially between targets
        // oxlint-disable-next-line eslint/no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, gapMs);
        });
      }
    }
  }
  return {
    animate,
    playSequence,
  };
}

export { useQuestionCardHighlight };