import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { callOnceMock } = vi.hoisted(() => ({
  callOnceMock: vi.fn<(callback?: () => unknown) => unknown>(),
}));

mockNuxtImport("callOnce", () => callOnceMock);