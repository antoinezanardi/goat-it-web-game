import { vi } from "vitest";

vi.mock("h3", async importOriginal => {
  // Acceptable as we need the original types/exports from h3 alongside mocked functions
  // oxlint-disable-next-line typescript/consistent-type-imports
  const original = await importOriginal<typeof import("h3")>();

  return {
    ...original,
    createError: vi.fn<typeof original.createError>(),
    getCookie: vi.fn<typeof original.getCookie>(),
    getRequestHeader: vi.fn<typeof original.getRequestHeader>(),
    getRouterParam: vi.fn<typeof original.getRouterParam>(),
    getValidatedQuery: vi.fn<typeof original.getValidatedQuery>(),
    readBody: vi.fn<typeof original.readBody>(),
    readValidatedBody: vi.fn<typeof original.readValidatedBody>(),
  };
});