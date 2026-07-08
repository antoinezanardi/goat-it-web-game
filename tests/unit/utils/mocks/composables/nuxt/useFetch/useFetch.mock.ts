import { vi } from "vitest";
import type { Mock } from "vitest";
import type { $Fetch } from "nitropack";

type FetchMock = Mock<$Fetch>;

/**
 * Creates a mock implementation of the `$fetch` global for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createFetchMock(): FetchMock {
  return vi.fn<$Fetch>();
}

export type { FetchMock };

export { createFetchMock };