import { vi } from "vitest";
import type { Mock } from "vitest";

import type { createError } from "#app";

type CreateErrorMock = Mock<typeof createError>;

/**
 * Creates a mock implementation of the `createError` Nuxt utility for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createCreateErrorMock(): CreateErrorMock {
  return vi.fn<typeof createError>();
}

export type { CreateErrorMock };

export { createCreateErrorMock };