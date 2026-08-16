import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { definePageMetaMock } = vi.hoisted(() => ({
  definePageMetaMock: vi.fn<() => void>(),
}));

mockNuxtImport("definePageMeta", () => definePageMetaMock);

export { definePageMetaMock };