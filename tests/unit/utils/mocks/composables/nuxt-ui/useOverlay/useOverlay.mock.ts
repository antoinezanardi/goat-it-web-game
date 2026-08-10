import type { Mock } from "vitest";
import { vi } from "vitest";

import type { UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

type UseOverlayMock = {
  create: Mock<() => UseOverlayCreateReturnValue>;
};

function createUseOverlayMock(): UseOverlayMock {
  const create: Mock<() => UseOverlayCreateReturnValue> = vi.fn<() => UseOverlayCreateReturnValue>(() => {
    const deferred: { resolve?: (value: boolean) => void } = {};
    const result: Promise<boolean> = new Promise(resolve => {
      deferred.resolve = resolve;
    });

    return {
      close: vi.fn<(value: boolean) => void>().mockImplementation((value: boolean) => {
        deferred.resolve?.(value);
      }),
      open: vi.fn<() => { result: Promise<boolean> }>(() => ({ result })),
    };
  });

  return { create };
}

export type { UseOverlayMock };

export { createUseOverlayMock };