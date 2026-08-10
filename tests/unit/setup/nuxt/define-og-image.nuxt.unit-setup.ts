import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { defineOgImageMock } = vi.hoisted(() => ({
  defineOgImageMock: vi.fn<() => void>(),
}));

mockNuxtImport("defineOgImage", () => defineOgImageMock);