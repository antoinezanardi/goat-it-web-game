import type { Mock } from "vitest";
import { vi } from "vitest";

import type { OverlayOpenReturnValue, UseOverlayCreateReturnValue } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock.types";

type UseOverlayMock = {
  create: Mock<() => UseOverlayCreateReturnValue>;
};

function createUseOverlayMock(): UseOverlayMock {
  const create: Mock<() => UseOverlayCreateReturnValue> = vi.fn<() => UseOverlayCreateReturnValue>(() => {
    const deferred: { resolve?: (value: boolean) => void } = {};
    const resultPromise: Promise<boolean> = new Promise(resolve => {
      deferred.resolve = resolve;
    });

    const openReturnValue: OverlayOpenReturnValue = Object.assign(resultPromise, { result: resultPromise });

    return {
      close: vi.fn<(value: boolean) => void>().mockImplementation((value: boolean) => {
        deferred.resolve?.(value);
      }),
      open: vi.fn<() => OverlayOpenReturnValue>(() => openReturnValue),
    };
  });

  return { create };
}

export type { UseOverlayMock };

export { createUseOverlayMock };