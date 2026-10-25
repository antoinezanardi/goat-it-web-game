import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, vi } from "vitest";
import type { Mock } from "vitest";

import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

type GetRouteRules = (options: { path: string }) => Record<string, unknown>;

const getRouteRulesMock: MockHolder<Mock<GetRouteRules>> = {
  instance: vi.fn<GetRouteRules>(() => ({})),
};

mockNuxtImport("getRouteRules", () => (options: { path: string }): Record<string, unknown> => getRouteRulesMock.instance(options));

beforeEach(() => {
  getRouteRulesMock.instance = vi.fn<GetRouteRules>(() => ({}));
});

export { getRouteRulesMock };