import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { useHeadMock } = vi.hoisted(() => ({
  useHeadMock: vi.fn<() => void>(),
}));

mockNuxtImport("useHead", () => useHeadMock);