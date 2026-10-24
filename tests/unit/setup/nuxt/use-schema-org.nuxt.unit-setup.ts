import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { useSchemaOrgMock } = vi.hoisted(() => ({
  useSchemaOrgMock: vi.fn<(input: unknown[]) => void>(),
}));

mockNuxtImport("useSchemaOrg", () => useSchemaOrgMock);