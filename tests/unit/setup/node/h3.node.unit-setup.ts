import { vi } from "vitest";

vi.mock("h3", async importOriginal => {
  // Acceptable as we need the original types/exports from h3 alongside mocked functions
  // oxlint-disable-next-line typescript/consistent-type-imports
  const original = await importOriginal<typeof import("h3")>();

  return {
    ...original,
    getRouterParam: vi.fn<typeof original.getRouterParam>(),
    createError: vi.fn<typeof original.createError>(),
    readBody: vi.fn<typeof original.readBody>(),
  };
});