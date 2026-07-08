import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { createErrorMock } = vi.hoisted(() => ({
  createErrorMock: vi.fn<() => void>(),
}));

mockNuxtImport("createError", () => createErrorMock);