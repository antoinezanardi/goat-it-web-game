import { vi } from "vitest";
import { ref } from "vue";
import type { Ref } from "vue";
import type {
  Router,
} from "vue-router";

import { DEFAULT_MOCKED_ROUTE, MOCKED_ROUTES } from "~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.constants";
import type { RouteMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.types";
import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

type UseRouterStub = {
  getRoutes: () => RouteMock[];
  currentRoute: Ref<RouteMock>;
  push: Router["push"];
  afterEach: Router["afterEach"];
  beforeResolve: Router["beforeResolve"];
  beforeEach: Router["beforeEach"];
  replace: Router["replace"];
  onError: Router["onError"];
};

type UseRouterMock = ToMock<UseRouterStub>;

/**
 * Creates a mock implementation of the `useRouter` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseRouterMock(): UseRouterMock {
  return {
    getRoutes: vi.fn<UseRouterStub["getRoutes"]>(() => [...MOCKED_ROUTES]),
    currentRoute: ref(DEFAULT_MOCKED_ROUTE),
    push: vi.fn<UseRouterStub["push"]>(),
    afterEach: vi.fn<UseRouterStub["afterEach"]>(),
    beforeResolve: vi.fn<UseRouterStub["beforeResolve"]>(),
    beforeEach: vi.fn<UseRouterStub["beforeEach"]>(),
    replace: vi.fn<UseRouterStub["replace"]>(),
    onError: vi.fn<UseRouterStub["onError"]>(),
  };
}

export type { UseRouterMock };

export { createUseRouterMock };