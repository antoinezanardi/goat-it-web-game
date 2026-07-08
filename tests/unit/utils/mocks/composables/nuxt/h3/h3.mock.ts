import { vi } from "vitest";
import type { Mock } from "vitest";
import type { getQuery, getRouterParam, readBody } from "h3";

type GetQueryMock = Mock<typeof getQuery>;

type GetRouterParameterMock = Mock<typeof getRouterParam>;

type ReadBodyMock = Mock<typeof readBody>;

/**
 * Creates a mock implementation of the `getQuery` H3 global for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createGetQueryMock(): GetQueryMock {
  return vi.fn<typeof getQuery>().mockReturnValue({});
}

/**
 * Creates a mock implementation of the `getRouterParam` H3 global for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createGetRouterParameterMock(): GetRouterParameterMock {
  return vi.fn<typeof getRouterParam>();
}

/**
 * Creates a mock implementation of the `readBody` H3 global for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createReadBodyMock(): ReadBodyMock {
  return vi.fn<typeof readBody>();
}

export type { GetQueryMock, GetRouterParameterMock as GetRouterParamMock, ReadBodyMock };

export { createGetQueryMock, createGetRouterParameterMock as createGetRouterParamMock, createReadBodyMock };