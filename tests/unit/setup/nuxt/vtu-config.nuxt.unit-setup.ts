import { config } from "@vue/test-utils";
import { beforeAll, beforeEach, afterAll, vi } from "vitest";

const originalGlobalConfig = { ...config.global };

beforeAll(() => {
  config.global.renderStubDefaultSlot = true;
  config.global.stubs = {
    ...config.global.stubs,
    "u-tooltip": true,
  };
});

beforeEach(() => {
  config.global.mocks = {
    ...config.global.mocks,
    $t: vi.fn<(key: string) => string>(key => key),
    $tc: vi.fn<(key: string, count: number) => string>(key => key),
  };
});

afterAll(() => {
  config.global = originalGlobalConfig;
});