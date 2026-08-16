import { ref } from "vue";
import type { Ref } from "vue";
import type { UseWindowScrollOptions } from "@vueuse/core";

type UseWindowScrollMock = {
  capturedOptions: { current: UseWindowScrollOptions | undefined };
  x: Ref<number>;
  y: Ref<number>;
};

function createUseWindowScrollMock(): UseWindowScrollMock {
  return {
    capturedOptions: { current: undefined },
    x: ref(0),
    y: ref(0),
  };
}

export type { UseWindowScrollMock };

export { createUseWindowScrollMock };