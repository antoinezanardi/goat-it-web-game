import { vi } from "vitest";
import type { Mock } from "vitest";

type QueryCollectionMockEntry = {
  all: () => Promise<unknown>;
};

type QueryCollectionMockSignature = (collection: string) => QueryCollectionMockEntry;

type QueryCollectionMock = Mock<QueryCollectionMockSignature>;

function createQueryCollectionMock(): QueryCollectionMock {
  return vi.fn<QueryCollectionMockSignature>().mockReturnValue({
    all: vi.fn<() => Promise<unknown>>().mockResolvedValue([]),
  });
}

export type {
  QueryCollectionMock,
  QueryCollectionMockEntry,
  QueryCollectionMockSignature,
};

export { createQueryCollectionMock };