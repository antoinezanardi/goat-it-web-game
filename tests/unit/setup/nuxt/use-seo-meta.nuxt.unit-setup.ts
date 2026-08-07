import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { useSeoMetaMock } = vi.hoisted(() => ({
  useSeoMetaMock: vi.fn<() => void>(),
}));

mockNuxtImport("useSeoMeta", () => useSeoMetaMock);