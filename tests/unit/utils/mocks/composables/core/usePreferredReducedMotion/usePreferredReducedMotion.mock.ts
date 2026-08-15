import { ref } from "vue";
import type { Ref } from "vue";
import type { ReducedMotionType } from "@vueuse/core";

type UsePreferredReducedMotionMock = {
  preferredReducedMotionRef: Ref<ReducedMotionType>;
};

function createUsePreferredReducedMotionMock(): UsePreferredReducedMotionMock {
  return {
    preferredReducedMotionRef: ref<ReducedMotionType>("no-preference"),
  };
}

export type { UsePreferredReducedMotionMock };

export { createUsePreferredReducedMotionMock };