import { vi } from "vitest";
import type { Mock } from "vitest";
import type { getQuery, getRouterParam, readBody, H3Event } from "h3";

type GetQueryMock = Mock<typeof getQuery>;

type GetRouterParameterMock = Mock<typeof getRouterParam>;

type ReadBodyMock = Mock<typeof readBody>;

type ValidateDataFunction = (data: unknown) => unknown;

type GetValidatedQueryMock = Mock<(event: H3Event, validate: ValidateDataFunction) => Promise<unknown>>;

type ReadValidatedBodyMock = Mock<(event: H3Event, validate: ValidateDataFunction) => Promise<unknown>>;

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

/**
 * Creates an emulated validation error matching h3 v1's `createValidationError` output.
 * Can only be used from unit tests setup functions.
 */
function throwEmulatedValidationError(cause?: unknown): never {
  throw Object.assign(new Error(cause instanceof Error ? cause.message : "Validation Error"), {
    statusCode: 400,
    statusMessage: "Validation Error",
    data: cause,
  });
}

/**
 * Emulates h3 v1's internal `validateData`: runs the validator and wraps any failure as a 400 error.
 * Can only be used from unit tests setup functions.
 */
async function emulateValidation(data: unknown, validate: ValidateDataFunction): Promise<unknown> {
  try {
    const result = await validate(data);
    if (result === false) {
      throwEmulatedValidationError();
    }
    if (result === true) {
      return data;
    }
    return result ?? data;
  } catch(error: unknown) {
    throwEmulatedValidationError(error);
  }
}

/**
 * Creates a mock implementation of the `getValidatedQuery` H3 global for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createGetValidatedQueryMock(getQueryMock: GetQueryMock): GetValidatedQueryMock {
  return vi.fn<(event: H3Event, validate: ValidateDataFunction) => Promise<unknown>>()
    .mockImplementation(async(event, validate) => emulateValidation(getQueryMock(event), validate));
}

/**
 * Creates a mock implementation of the `readValidatedBody` H3 global for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createReadValidatedBodyMock(readBodyMock: ReadBodyMock): ReadValidatedBodyMock {
  return vi.fn<(event: H3Event, validate: ValidateDataFunction) => Promise<unknown>>()
    .mockImplementation(async(event, validate) => emulateValidation(await readBodyMock(event), validate));
}

export type { GetQueryMock, GetRouterParameterMock as GetRouterParamMock, ReadBodyMock, GetValidatedQueryMock, ReadValidatedBodyMock };

export { createGetQueryMock, createGetRouterParameterMock as createGetRouterParamMock, createReadBodyMock, createGetValidatedQueryMock, createReadValidatedBodyMock };